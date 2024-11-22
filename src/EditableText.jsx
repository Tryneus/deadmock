import {observer} from 'mobx-react-lite';
import classNames from 'classnames';
import {useState, useCallback, useRef, useEffect} from 'preact/hooks';
import {Markdown} from './markdown';
import './EditableText.css';

const EditableText = observer(({text, color, size, weight, onChange}) => {
  const style = {color, fontSize: size, fontWeight: weight};
  return (
    <span
      contenteditable
      className='mock-editable-text'
      spellcheck={false}
      onChange={onChange}
      style={style}
    >
      {text}
    </span>
  );
});

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
  const inner = editing ? text : <Markdown {...{text, format}} />;

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

export {EditableText, EditableMarkdown};
export default EditableText;
