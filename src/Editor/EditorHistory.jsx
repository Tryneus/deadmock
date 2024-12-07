import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';
import PropTypes from 'prop-types';

import {Icon} from '../Icon';
import {loadHistory} from '../State';
import {examples} from '../example';
import './EditorHistory.css';

const EditorHistoryTemplate = ({state, data, onClose}) => {
  const classes = classNames('mock-editor-history-template', `mock-editor-history-${data.category}`);
  const onClick = useCallback(() => {
    state.loadRaw(data);
    onClose();
  }, [onClose, state, data]);

  return (
    <div className={classes} onClick={onClick}>
      <span>{data.name}</span>
      <span>Template</span>
    </div>
  );
};

EditorHistoryTemplate.propTypes = {
  state:   PropTypes.object.isRequired,
  data:    PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

const prettyTimeDelta = (timestamp, now) => {
  if (!timestamp || !now) {
    return null;
  }

  const delta = (now - timestamp) / 1000;
  if (delta < 0) {
    return 'in the future';
  }
  if (delta <= 2) {
    return '1 second ago';
  } else if (delta < 60) {
    return `${Math.floor(delta)} seconds ago`;
  } else if (delta < 120) {
    return '1 minute ago';
  } else if (delta < 3600) {
    return `${Math.floor(delta / 60)} minutes ago`;
  } else if (delta < 7200) {
    return '1 hour ago';
  } else if (delta < 172800) {
    return `${Math.floor(delta / 3600)} hours ago`;
  }
  return `${Math.floor(delta / 86400)} days ago`;
};

const EditorHistoryEntry = ({state, data, onClose}) => {
  const [now, setNow] = useState(null);
  const classes = classNames('mock-editor-history-entry', `mock-editor-history-${data.category}`);
  const onClick = useCallback(() => {
    if (onClose) {
      state.loadRecord(data.id);
      onClose();
    }
  }, [state, data, onClose]);

  // Rerender every 1s
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [setNow]);

  const timeDelta = prettyTimeDelta(data.timestamp, now) || 0;

  return (
    <div className={classes} onClick={onClick}>
      <span>{data.name}</span>
      <span>{timeDelta}</span>
    </div>
  );
};

EditorHistoryEntry.propTypes = {
  state:   PropTypes.object.isRequired,
  data:    PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

const EditorHistoryCurrent = ({data}) => {
  const classes = classNames('mock-editor-history-current', `mock-editor-history-${data.category}`);
  return (
    <div className={classes}>
      <span>{data.name}</span>
      <span />
    </div>
  );
};

EditorHistoryCurrent.propTypes = {
  data: PropTypes.object,
};

const EditorHistoryClear = ({state, onClose}) => {
  const classes = classNames('mock-editor-history-entry', `mock-editor-history-clear`);
  const onClick = useCallback(() => {
    state.clearData();
    onClose();
  }, [state, onClose]);

  return (
    <div className={classes} onClick={onClick}>
      <span>Clear Data</span>
    </div>
  );
};

EditorHistoryClear.propTypes = {
  state:   PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

const EditorHistoryDropdown = ({state, onClose}) => {
  const ref = useRef(null);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const h = loadHistory();
    h.splice(0, 1); // Remove latest (currently active) record
    setHistory(h);
  }, [setHistory]);

  // Dismiss dropdown if user clicks outside of it
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [ref, onClose]);

  return (
    <div ref={ref} className="mock-editor-history-dropdown">
      <div>
        {history.map((x, i) => <EditorHistoryEntry key={i} data={x} state={state} onClose={onClose} />)}
        {examples.map((x) => <EditorHistoryTemplate key={x.name} data={x} state={state} onClose={onClose} />)}
        <EditorHistoryClear state={state} onClose={onClose} />
      </div>
    </div>
  );
};

EditorHistoryDropdown.propTypes = {
  state:   PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

const getActiveInfo = (state) => {
  const {category, name} = state.activeModel;
  return {category, name};
};

const EditorHistory = observer(({state}) => {
  const [open, setOpen] = useState(false);

  const onToggle = useCallback(() => setOpen((x) => !x), [setOpen]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);

  return (
    <div className="mock-editor-history">
      <Icon image="dropdown" onClick={onToggle} />
      {open && <EditorHistoryDropdown state={state} onClose={onClose} />}
      <div onClick={onToggle}>
        <EditorHistoryCurrent data={getActiveInfo(state)} />
      </div>
    </div>
  );
});

EditorHistory.propTypes = {
  state: PropTypes.object.isRequired,
};

export {EditorHistory};
