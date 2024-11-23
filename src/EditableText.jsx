import {observer} from 'mobx-react-lite';
import classNames from 'classnames';
import {useState, useCallback, useRef, useEffect} from 'preact/hooks';
import {Markdown} from './markdown';
import {Icon} from './icon';
import './EditableText.css';

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
      ref.current.focus();
      window.getSelection().selectAllChildren(ref.current);
    }, 0);
  });

  const editingOff = useCallback((e) => {
    setEditing(false);
    onChange(e.target.innerText);
    e.target.innerText = ""; // react seems to have trouble with the DOM changing due to user editing?
    window.getSelection().removeAllRanges();
  });

  const style = {color, fontSize: size, fontWeight: weight};
  const inner = editing ? preserveNewlines(text) : children;

  return (
    <span
      contenteditable
      className='mock-editable-text'
      spellcheck={false}
      onMouseDown={editing ? null : editingOn}
      onBlur={editingOff}
      style={style}
      ref={ref}
    >
      {inner}
    </span>
  );
});

// React discards the newlines otherwise, so shove in some line-break elements
const preserveNewlines = (text) => (
    <>
      {text.split('\n').reduce((acc, x) => acc === null ? x : <>{acc}<br />{x}</>)}
    </>
);

const EditableMarkdown = observer(({text, format, onChange, color, size, weight}) => {
  const ref = useRef(null);
  const [editing, setEditing] = useState(false);

  const editingOn = useCallback(() => {
    setEditing(true);
    // For some reason this does nothing without an immediate timeout
    setTimeout(() => {
      ref.current.focus();
      window.getSelection().selectAllChildren(ref.current);
    }, 0);
  });

  const editingOff = useCallback((e) => {
    setEditing(false);
    onChange(e.target.innerText);
    e.target.innerText = ""; // react seems to have trouble with the DOM changing due to user editing?
  });

  const style = {color, fontSize: size, fontWeight: weight};
  const inner = editing ? preserveNewlines(text) : <Markdown {...{text, format}} />;

  return (
    <span
      contenteditable
      className='mock-editable-text'
      spellcheck={false}
      onMouseDown={editing ? null : editingOn}
      onBlur={editingOff}
      style={style}
      ref={ref}
    >
      {inner}
    </span>
  );
});

const EditableIcon = observer(({model}) => {
  return (
    <Icon image={model.image} size={model.size} color={model.color} />
  );
});

export {EditableText, EditableMarkdown, EditableIcon};
export default EditableText;
