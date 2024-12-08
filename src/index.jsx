import {render} from 'preact';
import {Editor} from './Editor';
import {State, serializationVersion} from './State';

import './style.css';

// Check for a fragment, which may be a serialized model to load
const loadFragment = (fragment) => {
  try {
    const data = JSON.parse(window.atob(fragment.replace('#', '')));
    const version = data?.version;
    if (!version) {
      throw new Error('fragment is missing a serialization version');
    } else if (version !== serializationVersion) {
      throw new Error(`fragment has an unrecognized serialization version: ${JSON.stringify(version)}`);
    }
    return data;
  } catch (e) {
    console.error('failed to load model from fragment:', e);
  }
};

const state = new State();
if (window.location.hash) {
  const raw = loadFragment(window.location.hash);
  if (raw) {
    state.loadRaw(raw);
    window.location.hash = '';
  }
}

render(<Editor state={state} />, document.getElementById('app'));
