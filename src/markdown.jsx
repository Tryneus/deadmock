import markdownit from 'markdown-it';
import {Text} from './text';

const parser = new markdownit('zero', {breaks: true});
parser.enable(['emphasis', 'newline']);

const convertTokens = (tokens) => {
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
      const children = stack.pop();
      stack[stack.length - 1].push(<Text variant="semibold" bright>{children}</Text>);
      flags.strong = false;
    } else if (x.type === 'em_close') {
      const children = stack.pop();
      stack[stack.length - 1].push(<Text variant="medium" italic muted>{children}</Text>);
      flags.em = false;
    }
  });

  console.log('stack', stack);
  console.log('tokens', tokens);

  if (stack.length != 1) {
    console.log('invalid markdown stack:', stack, tokens);
  }

  return (
    <Text variant="medium">{stack[0]}</Text>
  );
};

const Markdown = ({text}) => {
  const tokens = parser.parseInline(text);
  const md = convertTokens(tokens[0].children);

  return <>{md}</>;
};

export {Markdown};
export default Markdown;

`[
  {
    "type": "paragraph_open",
    "tag": "p",
    "attrs": null,
    "map": [
      0,
      2
    ],
    "nesting": 1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "inline",
    "tag": "",
    "attrs": null,
    "map": [
      0,
      2
    ],
    "nesting": 0,
    "level": 1,
    "children": [
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "Deals ",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "strong_open",
        "tag": "strong",
        "attrs": null,
        "map": null,
        "nesting": 1,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "**",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 1,
        "children": null,
        "content": "Spirit Damage",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "strong_close",
        "tag": "strong",
        "attrs": null,
        "map": null,
        "nesting": -1,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "**",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": ", ",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "strong_open",
        "tag": "strong",
        "attrs": null,
        "map": null,
        "nesting": 1,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "**",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 1,
        "children": null,
        "content": "Slows",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "strong_close",
        "tag": "strong",
        "attrs": null,
        "map": null,
        "nesting": -1,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "**",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": " targets movement and dashes.  Also ",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "strong_open",
        "tag": "strong",
        "attrs": null,
        "map": null,
        "nesting": 1,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "**",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 1,
        "children": null,
        "content": "Silences their movement-based items and abilities.",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "strong_close",
        "tag": "strong",
        "attrs": null,
        "map": null,
        "nesting": -1,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "**",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "softbreak",
        "tag": "br",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "em_open",
        "tag": "em",
        "attrs": null,
        "map": null,
        "nesting": 1,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "_",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 1,
        "children": null,
        "content": "Does not affect target's stamina usage.",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "em_close",
        "tag": "em",
        "attrs": null,
        "map": null,
        "nesting": -1,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "_",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      }
    ],
    "content": "Deals **Spirit Damage**, **Slows** targets movement and dashes.  Also **Silences their movement-based items and abilities.**\\n_Does not affect target's stamina usage._",
    "markup": "",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "paragraph_close",
    "tag": "p",
    "attrs": null,
    "map": null,
    "nesting": -1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  }
]`
