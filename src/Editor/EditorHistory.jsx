import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';
import PropTypes from 'prop-types';

import {Icon} from '../Icon';
import {loadHistory} from '../State';
import {Text} from '../Text';
import {examples} from '../example';
import './EditorHistory.css';

const EditorHistoryTemplate = ({state, data, onClose}) => {
  const classes = classNames('mock-editor-history-template', `mock-editor-history-entry-${data.category}`);
  const onClick = useCallback(() => {
    if (onClose) {
      state.loadRaw(data);
      onClose();
    }
  }, [onClose, state, data]);

  return (
    <div className={classes} onClick={onClick}>
      <span>{data.name}</span>
      <Text italic size={10} weight={400}>Template</Text>
    </div>
  );
};

EditorHistoryTemplate.propTypes = {
  state:   PropTypes.object.isRequired,
  data:    PropTypes.object.isRequired,
  onClose: PropTypes.func,
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
  const classes = classNames('mock-editor-history-entry', `mock-editor-history-entry-${data.category}`);
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

  const timeDelta = prettyTimeDelta(data.timestamp, now);

  return (
    <div className={classes} onClick={onClick}>
      <span>{data.name}</span>
      {timeDelta && <Text italic size={10} weight={400}>{timeDelta}</Text>}
    </div>
  );
};

EditorHistoryEntry.propTypes = {
  state:   PropTypes.object.isRequired,
  data:    PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

const EditorHistoryDropdown = ({state, onClose}) => {
  const ref = useRef(null);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const h = loadHistory();
    console.log('history', h);
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
        <EditorHistoryEntry data={getActiveInfo(state)} state={state} />
      </div>
    </div>
  );
});

EditorHistory.propTypes = {
  state: PropTypes.object.isRequired,
};

export {EditorHistory};
