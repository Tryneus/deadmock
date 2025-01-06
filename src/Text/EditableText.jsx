import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback, useRef, useState} from 'preact/hooks';

import {Markdown} from './Markdown';
import './EditableText.css';

// React discards the newlines otherwise, so shove in some line-break elements
const preserveNewlines = (text) => (
  <>
    {text.split('\n').reduce((acc, x) => {
      if (acc === null) {
        return x;
      }
      return (
        <>
          {acc}
          <br />
          {x}
        </>
      );
    })}
  </>);

const handleEditingOn = (ref, setEditing) => {
  setEditing(true);
  setTimeout(() => {
    ref.current.contentEditable = 'true';
    ref.current.focus();
    window.getSelection().selectAllChildren(ref.current);
  }, 0);
};

const handleEditingOff = (ev, setEditing, onChange) => {
  setEditing(false);
  onChange(ev.target.innerText.replaceAll(/\n+/g, '\n').trim());
  // react seems to have trouble with the DOM changing due to user editing?
  ev.target.innerText = '';
  ev.target.contentEditable = 'false';
  ev.target.scrollTo({top: 0, left: 0});
  window.getSelection().removeAllRanges();
};

const EditableText = observer(({onChange, children}) => {
  const ref = useRef(null);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(null);

  const editingOn = useCallback(() => {
    setText(ref.current.innerText);
    handleEditingOn(ref, setEditing);
  }, [ref, setEditing, setText]);

  const editingOff = useCallback((e) => {
    handleEditingOff(e, setEditing, onChange);
  }, [setEditing, onChange]);

  const inner = editing ? preserveNewlines(text) : children;
  const classes = classNames('mock-editable-text', 'mock-text', {
    'mock-text-color-bright': editing,
  });

  return (
    <span
      ref={ref}
      className={classes}
      spellCheck={false}
      onBlur={editingOff}
      onMouseDown={editing ? null : editingOn}
    >
      {inner}
    </span>
  );
});

const EditableMarkdown = observer(({text, format, onChange}) => {
  const ref = useRef(null);
  const [editing, setEditing] = useState(false);

  const editingOn = useCallback(() => {
    handleEditingOn(ref, setEditing);
  }, [ref, setEditing]);

  const editingOff = useCallback((e) => {
    handleEditingOff(e, setEditing, onChange);
  }, [setEditing, onChange]);

  const inner = editing ? preserveNewlines(text) : <Markdown format={format} text={text} />;
  const classes = classNames('mock-editable-markdown', 'mock-text', {
    'mock-text-color-bright': editing,
  });

  return (
    <div
      ref={ref}
      className={classes}
      spellCheck={false}
      onBlur={editingOff}
      onMouseDown={editing ? null : editingOn}
    >
      {inner}
    </div>
  );
});

export {EditableMarkdown, EditableText};
