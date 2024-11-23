import {observer} from 'mobx-react-lite';
import {useCallback, useRef, useState} from 'preact/hooks';
import {Icon} from './icon';
import {Markdown} from './markdown';
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

  const style = {color, fontSize: size, fontWeight: weight};
  const inner = editing ? preserveNewlines(text) : children;

  return (
    <span
      className="mock-editable-text"
      onBlur={editingOff}
      onMouseDown={editing ? null : editingOn}
      ref={ref}
      spellCheck={false}
      style={style}
    >
      {inner}
    </span>
  );
});

// React discards the newlines otherwise, so shove in some line-break elements
const preserveNewlines = (text) => (
  <>
    {text.split('\n').reduce((acc, x) => (acc === null ?
      x :
      <>
        {acc}
        <br />
        {x}
      </>
    ))}
  </>);

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
    onChange(e.target.innerText);
    e.target.innerText = ''; // react seems to have trouble with the DOM changing due to user editing?
    e.target.contentEditable = 'false';
    window.getSelection().removeAllRanges();
  }, [setEditing, onChange]);

  const style = {color, fontSize: size, fontWeight: weight};
  const inner = editing ? preserveNewlines(text) : <Markdown {...{text, format}} />;

  return (
    <span
      className="mock-editable-text"
      onBlur={editingOff}
      onMouseDown={editing ? null : editingOn}
      ref={ref}
      spellCheck={false}
      style={style}
    >
      {inner}
    </span>
  );
});

const EditableIcon = observer(({model}) => <Icon color={model.color} image={model.image} size={model.size} />);

export {EditableIcon, EditableMarkdown, EditableText};
export default EditableText;
