import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback, useContext, useEffect, useRef, useState} from 'preact/hooks';

import {prettyTimeDelta, useAction, useClickOutside, useNow} from '/src/Common';
import {HoldTimer} from '/src/HoldTimer';
import {Icon} from '/src/Icon';
import {ModelStorageContext, templates} from '/src/Serialize';

import './EditorHistory.css';

const EditorHistoryCurrent = ({category, name, onMouseDown}) => {
  const classes = classNames(
    'mock-editor-history-current',
    `mock-editor-history-${category}`,
  );
  return (
    <div className={classes} onMouseDown={onMouseDown}>
      <span>{name || '-'}</span>
      <span />
      <span />
    </div>
  );
};

const EditorHistoryEntry = ({state, data, onClose}) => {
  const modelStorage = useContext(ModelStorageContext);
  const now = useNow();

  const onClick = useCallback(() => {
    state.loadRecord(data.id);
    onClose();
  }, [state, data, onClose]);

  const onDelete = useCallback(() => {
    modelStorage.remove(data.id);
    onClose();
  }, [data, modelStorage, onClose]);

  const classes = classNames(
    'mock-editor-history-entry',
    `mock-editor-history-${data.category}`,
  );
  const timeDelta = prettyTimeDelta(data.timestamp, now) || 0;

  return (
    <div className={classes} onClick={onClick}>
      <span><span>{data.name || '-'}</span></span>
      <span>{timeDelta}</span>
      <span>
        <HoldTimer duration={1000} iconColor="white" image="trash" onComplete={onDelete} />
      </span>
    </div>
  );
};

const EditorHistoryCopy = ({state, onClose}) => {
  const model = state.activeModel;
  const classes = classNames(
    'mock-editor-history-template',
  );
  const onClick = useAction(() => {
    model.id = crypto.randomUUID();
    onClose();
  }, [model, onClose]);

  return (
    <div className={classes} onClick={onClick}>
      <span><span>Copy Current</span></span>
      <span>New</span>
      <span />
    </div>
  );
};

const EditorHistoryTemplate = ({data, label, state, onClose}) => {
  const classes = classNames(
    'mock-editor-history-template',
    `mock-editor-history-${data.category}`,
  );
  const onClick = useCallback(() => {
    state.loadRaw(data);
    onClose();
  }, [onClose, state, data]);

  return (
    <div className={classes} onClick={onClick}>
      <span><span>{label}</span></span>
      <span>New</span>
      <span />
    </div>
  );
};

const EditorHistoryClear = ({state, onClose}) => {
  const onClear = useCallback(() => {
    state.clearAll();
    onClose();
  }, [state, onClose]);

  return (
    <div className="mock-editor-history-clear">
      <HoldTimer duration={1000} iconColor="white" image="trash" onComplete={onClear}>
        <span>Clear Data</span>
      </HoldTimer>
    </div>
  );
};

const EditorHistoryDropdown = ({state, onClose}) => {
  const modelStorage = useContext(ModelStorageContext);
  const ref = useRef(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const data = modelStorage.history();
    data.splice(0, 1); // Remove latest (currently active) record
    setEntries(data);
  }, [setEntries, modelStorage]);

  // Dismiss dropdown if user clicks outside of it
  useClickOutside(ref, onClose);

  return (
    <div ref={ref} className="mock-editor-history-dropdown">
      <div>
        {entries.map((x, i) => <EditorHistoryEntry key={i} data={x} state={state} onClose={onClose} />)}
        <EditorHistoryCopy state={state} onClose={onClose} />
        {templates.map((x) => <EditorHistoryTemplate key={x.label} data={x.data} label={x.label} state={state} onClose={onClose} />)}
        <EditorHistoryClear state={state} onClose={onClose} />
      </div>
    </div>
  );
};

const EditorHistory = observer(({state}) => {
  const [open, setOpen] = useState(false);
  const {category, name} = state.activeModel || {};

  const onToggle = useCallback(() => setOpen((x) => !x), [setOpen]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);

  return (
    <div className="mock-editor-history">
      <Icon color="white" image="dropdown" onMouseDown={onToggle} />
      <div className="mock-editor-history-position">
        {open && <EditorHistoryDropdown state={state} onClose={onClose} />}
      </div>
      <EditorHistoryCurrent category={category} name={name} onMouseDown={onToggle} />
    </div>
  );
});

export {EditorHistory};
