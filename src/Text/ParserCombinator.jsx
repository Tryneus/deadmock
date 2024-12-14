// global variables for profit
const debug = false;
let depth = 0;

const debugWrap = (parser, name) => {
  if (!debug) {
    return parser;
  }
  const wrapped = (args) => {
    console.debug(`${' '.repeat(depth)}${name} (enter):`, JSON.stringify(args));

    const missingArgs = ['source', 'cursor'].filter((x) => args[x] === null || args[x] === undefined);
    if (missingArgs.length > 0) {
      throw new Error(`invalid args, missing "${missingArgs.join('", "')}":`);
    }

    depth += 1;
    const result = parser(args);
    depth -= 1;

    console.debug(`${' '.repeat(depth)}${name} (leave):`, JSON.stringify(result));

    const missingResults = ['source', 'cursor'].filter((x) => args[x] === null || args[x] === undefined);
    if (!result.error) {
      if (result.end === null || result.end === undefined) {
        missingResults.push('end');
      }
    }
    if (missingResults.length > 0) {
      throw new Error(`invalid result, missing "${missingResults.join('", "')}"`);
    }

    return result;
  };
  return wrapped;
};

const ok = (source, cursor, count, data) => ({source, cursor, end: cursor + count, data});
const err = (source, cursor, error) => ({source, cursor, error});

const end = debugWrap(({source, cursor}) => {
  if (cursor === source.length) {
    return ok(source, cursor, 0, null);
  }
  return err(source, cursor, 'end: more data in stream');
}, 'end');

const all = (...parsers) => debugWrap(({source, cursor}) => {
  const results = [];
  let current = cursor;
  for (let i = 0; i < parsers.length; i++) {
    const result = parsers[i]({source, cursor: current});
    if (result.error) {
      return err(source, cursor, `all[${i}].${result.error}`);
    }
    current = result.end;
    results.push(result.data);
  }
  return ok(source, cursor, current - cursor, results);
}, 'all');

const any = (...parsers) => debugWrap(({source, cursor}) => {
  for (const parser of parsers) {
    const result = parser({source, cursor});
    if (!result.error) {
      return result;
    }
  }
  return err(source, cursor, 'any: no match');
}, 'any');

const not = (parser) => debugWrap(({source, cursor}) => {
  const result = parser({source, cursor});
  if (result.error) {
    return ok(source, cursor, 0, null);
  }
  return err(source, cursor, 'not: subparser succeeded');
}, 'not');

const maybe = (parser) => debugWrap(({source, cursor}) => {
  const result = parser({source, cursor});
  if (result.error) {
    return ok(source, cursor, 0, null);
  }
  return result;
}, 'maybe');

const map = (parser, fn) => debugWrap(({source, cursor}) => {
  const result = parser({source, cursor});
  if (!result.error) {
    result.data = fn(result.data);
  }
  return result;
}, 'map');

const range = (min, max, parser) => debugWrap(({source, cursor}) => {
  const results = [];
  let lastErr = null;
  let current = cursor;
  let count = 0;
  while (count <= max) {
    const result = parser({source, cursor: current});
    if (result.error) {
      lastErr = result.error;
      break;
    }
    count += 1;
    current = result.end;
    results.push(result.data);
  }
  if (count < min) {
    return err(source, cursor, `range: found ${count} of ${min}, error: ${lastErr}`);
  }
  return ok(source, cursor, current - cursor, results);
}, 'range');

const count = (num, parser) => range(num, num, parser);
const many = (parser) => range(0, Infinity, parser);

// string-specific parsers
const char = (c) => debugWrap(({source, cursor}) => {
  if (source.length > cursor && source[cursor] === c) {
    return ok(source, cursor, 1, c);
  }
  return err(source, cursor, `char(${c}): no match`);
}, 'char');

// using a global regex is probably bad m'kay
const regex = (pattern) => debugWrap(({source, cursor}) => {
  const remaining = source.slice(cursor);
  const matches = remaining.match(pattern);
  if (!matches || matches.index !== 0) { // TODO: probably better if we can anchor the regex to the start
    return err(source, cursor, 'regex: no match');
  }
  return ok(source, cursor, matches[0].length, matches);
}, 'regex');

const ParserCombinator = (parser) => (source) => {
  const result = parser({source, cursor: 0});
  if (result.error) {
    throw new Error(result.error);
  }
  return result.data;
};

export {ParserCombinator, all, any, char, count, end, err, many, map, maybe, not, ok, range, regex};
