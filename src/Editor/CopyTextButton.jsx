import classNames from 'classnames';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';

import {Icon} from '/src/Icon';

import {plaintext} from './PlaintextExport';
import {bbcodeSimple, bbcodeColor} from './BBCodeExport';
import {markdown} from './MarkdownExport';
import './CopyTextButton.css'

const allFormats = [
  ['BBcode (simple)', bbcodeSimple],
  ['BBcode (color)', bbcodeColor],
  ['Markdown', markdown],
  ['Plaintext', plaintext],
];
const defaultFormat = allFormats[0][0];
const formatsByName = Object.fromEntries(allFormats);

const doFormat = (model, formatter) => {
  if (model.category === 'ability') {
    return formatter.formatAbility(model);
  }
  return formatter.formatItem(model);
};

const doCopy = (model, format) => {
  if (!formatsByName[format]) {
    throw new Error(`unknown export format: ${format}`);
  }
  const blob = new Blob([doFormat(model, formatsByName[format])], {type: 'text/plain'});
  navigator.clipboard.write([new ClipboardItem({'text/plain': blob})]);
};

const CopyTextEntry = ({format, selected, onChange}) => {
  const classes = classNames('mock-editor-copy-text-entry', {'mock-editor-copy-text-entry-selected': selected});
  const onClick = useCallback(() => onChange(format), [format, onChange]);
  return (
    <div className={classes} onClick={onClick}>
      {format}
    </div>
  );
};

const CopyTextDropdown = ({format, onChange, onClose}) => {
  const ref = useRef(null);

  // Dismiss dropdown if user clicks outside of it
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [ref, onClose]);

  const formats = Object.keys(formatsByName);
  return (
    <div ref={ref} className="mock-editor-copy-text-dropdown">
      <div>
        {formats.map((x) => <CopyTextEntry selected={x === format} format={x} onChange={onChange} />)}
      </div>
    </div>
  );
};

const CopyTextButton = ({model}) => {
  const [format, setFormat] = useState(defaultFormat);
  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => setOpen(true), [setOpen]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);
  const onClick = useCallback(() => doCopy(model, format), [model, format]);
  const onChangeFormat = useCallback((x) => {
    setFormat(x);
    setOpen(false);
  }, [setFormat, setOpen]);

  return (
    <div className="mock-editor-copy-text-button">
      <div onClick={onClick}>
        Copy Text
      </div>
      <Icon image="dropdown" onMouseDown={open ? null : onOpen} />
      {open && <CopyTextDropdown format={format} onChange={onChangeFormat} onClose={onClose} />}
    </div>
  );
};

export {CopyTextButton};
