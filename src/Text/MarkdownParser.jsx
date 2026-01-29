import {ParserCombinator, all, any, char, count, end, many, map, not, range, regex} from './ParserCombinator';

const whitespaceRegex = /[\t\r\f]|\p{Zs}/u;
const whitespace = regex(whitespaceRegex);
const isWhitespace = (x) => Boolean(x.match(whitespaceRegex));

const punctuationRegex = /\p{Pc}|\p{Pd}|\p{Pe}|\p{Pf}|\p{Pi}|\p{Po}|\p{Ps}|\p{Sc}|\p{Sk}|\p{Sm}|\p{So}/u;
const isPunctuation = (x) => Boolean(x.match(punctuationRegex));

const lineBreak = all(range(0, Infinity, whitespace), char('\n'), range(0, Infinity, whitespace));
const inlineLineBreak = map(all(lineBreak, not(lineBreak)), () => ({type: 'linebreak'}));
const paragraphBreak = count(2, lineBreak);

const escapeableRegex = /[!"#%&',-/:;<=>?@_`~^$\\.*+()[\]{}|/]/;
const escape = map(
  all(char('\\'), regex(escapeableRegex)),
  (x) => x[1][0],
);

const textRegex = /[^_*\n]+/;
const text = map(any(escape, map(regex(textRegex), (x) => x[0])), (x) => ({type: 'text', data: x}));

const tags = ({source, cursor}) => {
  const result = any(range(1, Infinity, char('*')), range(1, Infinity, char('_')))({source, cursor});
  if (result.error) {
    return result;
  }

  const before = source[cursor - 1];
  const after = source[result.end];

  const type = 'tag';
  const data = result.data.join('');
  const spaceBefore = !before || isWhitespace(before) || before === '\n';
  const punctBefore = before && isPunctuation(before);
  const spaceAfter = !after || isWhitespace(after) || after === '\n';
  const punctAfter = after && isPunctuation(after);
  const isLeftTag = !spaceAfter && (!punctAfter || spaceBefore || punctBefore);
  const isRightTag = !spaceBefore && (!punctBefore || spaceAfter || punctAfter);
  const canOpen = isLeftTag;
  const canClose = isRightTag;

  result.data = {type, data, canOpen, canClose};
  if (data[0] !== '*') {
    result.data.canOpen = canOpen && (!isRightTag || punctBefore);
    result.data.canClose = canClose && (!isLeftTag || punctAfter);
  }

  return result;
};

const makeEmphNode = (nodes) => {
  const delims = Math.min(2, Math.min(nodes[0].data.length, nodes[nodes.length - 1].data.length));
  const type = delims === 2 ? 'strong' : 'em';
  return {type, delims, data: nodes.slice(1, nodes.length - 1)};
};

// implemented based on the suggested algorithm from the CommonMark 0.31.2 spec, Appendix A, 'process emphasis'
const processEmphasis = (nodes) => {
  let current = 0;
  const openerFloor = {'*': 0, '_': 0};

  while (current < nodes.length) {
    const closer = nodes[current];
    if (closer.type === 'tag' && closer.canClose) {
      let openerIndex = null;
      const tagType = closer.data[0];
      const tagFloor = openerFloor[tagType];
      for (let i = current - 1; i >= tagFloor; i--) {
        const opener = nodes[i];
        if (opener.type === 'tag' && opener.canOpen && opener.data[0] === closer.data[0]) {
          // if closer can also open, then the opener and closer can't be paired for 'em' if their combined lengths are a multiple of three, but their individual lengths are not
          if ((closer.canOpen || opener.canClose) && (opener.data.length + closer.data.length) % 3 === 0 && (opener.data.length % 3 !== 0 || closer.data.length % 3 !== 0) && (opener.data.length < 2 || closer.data.length < 2)) {
            continue;
          }
          openerIndex = i;
          break;
        }
      }

      if (openerIndex !== null) {
        const opener = nodes[openerIndex];
        const newNode = makeEmphNode(nodes.slice(openerIndex, current + 1));
        opener.data = opener.data.substring(0, opener.data.length - newNode.delims);
        closer.data = closer.data.substring(0, closer.data.length - newNode.delims);
        const spliceStart = openerIndex + (opener.data.length === 0 ? 0 : 1);
        const spliceEnd = current + (closer.data.length === 0 ? 1 : 0);
        const spliceCount = spliceEnd - spliceStart;

        nodes.splice(spliceStart, spliceCount, newNode);
        current = spliceStart; // Point to the new node, current will advance at the end of the loop
      } else {
        // TODO: need this working properly to not choke on pathological input
        // openerFloor[tagType] = current - 1;
      }
    }

    ++current;
  }
};

// After processing emphasis, roll unused tags into adjacent text nodes
const coalesceText = (parent) => {
  const newData = [];
  for (let i = 0; i < parent.data.length; i++) {
    const child = parent.data[i];
    if (child.type === 'tag' || child.type === 'text') {
      if (newData[newData.length - 1]?.type === 'text') {
        newData[newData.length - 1].data += child.data;
      } else {
        newData.push({type: 'text', data: child.data});
      }
    } else {
      if (Array.isArray(child.data)) {
        coalesceText(child);
      }
      newData.push(child);
    }
  }
  parent.data = newData;
};

const postprocessTree = (node) => {
  if (node.type === 'document') {
    node.data.forEach(postprocessTree);
  } else if (node.type === 'paragraph') {
    processEmphasis(node.data);
    coalesceText(node);
  }
  return node;
};

const paragraph = map(
  all(range(1, Infinity, any(tags, text, inlineLineBreak)), any(paragraphBreak, end)),
  (x) => ({type: 'paragraph', data: x[0]}),
);

const document = map(all(many(paragraph), end), (x) => postprocessTree({type: 'document', data: x[0]}));
const MarkdownParser = ParserCombinator(document);

export {MarkdownParser};
