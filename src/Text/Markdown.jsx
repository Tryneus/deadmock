import {MarkdownParser} from './MarkdownParser';
import {Text} from './Text';

const defaultFormat = {
  text:     {},
  strong:   {weight: 700, color: 'bright'},
  emphasis: {italic: true, color: 'muted'},
};

const convertTree = (node, format) => {
  if (node.type === 'document') {
    return <>{node.data.map((x) => convertTree(x, format))}</>;
  } else if (node.type === 'paragraph') {
    return (
      <>
        {node.data.map((x) => convertTree(x, format))}
        <br />
      </>
    );
  } else if (node.type === 'linebreak') {
    return <><br /></>;
  } else if (node.type === 'text') {
    return <Text {...format.text}>{node.data}</Text>;
  } else if (node.type === 'em') {
    return <Text {...format.emphasis}>{node.data.map((x) => convertTree(x, format))}</Text>;
  } else if (node.type === 'strong') {
    return <Text {...format.strong}>{node.data.map((x) => convertTree(x, format))}</Text>;
  }
  console.error('invalid node type');
};

const Markdown = ({text, format = defaultFormat}) => {
  if (!text) {
    return null;
  }
  const md = convertTree(MarkdownParser(text), format);

  return <>{md}</>;
};

export {Markdown};
