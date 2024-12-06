import {observer} from 'mobx-react-lite';
import {useCallback, useRef, useState} from 'preact/hooks';
import PropTypes from 'prop-types';

import {Markdown, textColors} from '../Text';

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

// TODO: try to unify this with the markdown version
const EditableText = observer(({color, size, weight, onChange, children}) => {
  const ref = useRef(null);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(null);

  const editingOn = useCallback(() => {
    setEditing(true);
    setText(ref.current.innerText);
    // For some reason this does nothing without an immediate timeout
    setTimeout(() => {
      ref.current.contentEditable = 'true';
      ref.current.focus();
      window.getSelection().selectAllChildren(ref.current);
    }, 0);
  }, [ref, setEditing, setText]);

  const editingOff = useCallback((e) => {
    setEditing(false);
    onChange(e.target.innerText);
    e.target.innerText = ''; // react seems to have trouble with the DOM changing due to user editing?
    e.target.contentEditable = 'false';
    window.getSelection().removeAllRanges();
  }, [setEditing, onChange]);

  const style = {color: textColors[color], fontSize: size, fontWeight: weight};
  const inner = editing ? preserveNewlines(text) : children;

  return (
    <span
      ref={ref}
      className="mock-editable-text mock-text"
      spellCheck={false}
      style={style}
      onBlur={editingOff}
      onMouseDown={editing ? null : editingOn}
    >
      {inner}
    </span>
  );
});

EditableText.propTypes = {
  color:    PropTypes.string,
  size:     PropTypes.number,
  weight:   PropTypes.oneOf([400, 500, 600, 700]),
  onChange: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const EditableMarkdown = observer(({text, format, onChange, color, size, weight}) => {
  const ref = useRef(null);
  const [editing, setEditing] = useState(false);

  const editingOn = useCallback(() => {
    setEditing(true);
    // For some reason this does nothing without an immediate timeout
    setTimeout(() => {
      ref.current.contentEditable = 'true';
      ref.current.focus();
      window.getSelection().selectAllChildren(ref.current);
    }, 0);
  }, [ref, setEditing]);

  const editingOff = useCallback((e) => {
    setEditing(false);
    onChange(e.target.innerText.trim());
    e.target.innerText = ''; // react seems to have trouble with the DOM changing due to user editing?
    e.target.contentEditable = 'false';
    window.getSelection().removeAllRanges();
  }, [setEditing, onChange]);

  const style = {color, fontWeight: weight, fontSize: size};
  const inner = editing ? preserveNewlines(text) : <Markdown format={format} text={text} />;

  return (
    <div
      ref={ref}
      className="mock-editable-text mock-text"
      spellCheck={false}
      style={style}
      onBlur={editingOff}
      onMouseDown={editing ? null : editingOn}
    >
      {inner}
    </div>
  );
});

EditableMarkdown.propTypes = {
  text:     PropTypes.string,
  format:   PropTypes.object,
  onChange: PropTypes.func,
  color:    PropTypes.string,
  size:     PropTypes.number,
  weight:   PropTypes.oneOf([400, 500, 600, 700]),
};

export {EditableMarkdown, EditableText};
