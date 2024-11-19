import markdownit from 'markdown-it';
import {Text} from './text';

const parser = new markdownit('zero', {breaks: true});
parser.enable(['emphasis', 'newline']);

const defaultFormat = {
  text: {
    Component: Text,
    props: {variant: 'medium'},
  },
  strong: {
    Component: Text,
    props: {variant: 'semibold', bright: true},
  },
  emphasis: {
    Component: Text,
    props: {variant: 'medium', italic: true, muted: true},
  },
};

const convertTokens = (tokens, format) => {
  const flags = {strong: false, em: false};
  const stack = [[]];

  tokens.forEach((x) => {
    if (x.type === 'text') {
      stack[stack.length - 1].push(x.content);
    } else if (x.type === 'softbreak') {
      stack[stack.length - 1].push(<br />);
    } else if (x.type === 'strong_open') {
      flags.strong = true;
      stack.push([]);
    } else if (x.type === 'em_open') {
      flags.em = true;
      stack.push([]);
    } else if (x.type === 'strong_close') {
      const {Component, props} = format.strong;
      props.children = stack.pop();
      stack[stack.length - 1].push(<Component {...props} />);
      flags.strong = false;
    } else if (x.type === 'em_close') {
      const {Component, props} = format.emphasis;
      props.children = stack.pop();
      stack[stack.length - 1].push(<Component {...props} />);
      flags.em = false;
    }
  });

  if (stack.length != 1) {
    console.log('invalid markdown stack:', stack, tokens);
  }

  const {Component, props} = format.text;
  props.children = stack[0];
  return <Component {...props} />;
};

const Markdown = ({text, format = defaultFormat}) => {
  if (!text) {
    return null;
  }
  const tokens = parser.parseInline(text);
  const md = convertTokens(tokens[0].children, format);

  return <>{md}</>;
};


export {Markdown};
export default Markdown;
