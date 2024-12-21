import {bbcodeColor, bbcodeSimple} from './BBCode';
import {markdown} from './Markdown';
import {plaintext} from './Plaintext';

const allFormats = [
  ['BBcode (simple)', bbcodeSimple],
  ['BBcode (color)', bbcodeColor],
  ['Markdown', markdown],
  ['Plaintext', plaintext],
];
const defaultExportFormat = allFormats[0][0];
const exportFormats = Object.fromEntries(allFormats);

export {defaultExportFormat, exportFormats};
