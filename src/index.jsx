import {render} from 'preact';
import {Editor} from './Editor';
import {State, serializationVersion} from './State';

import './style.css';

// Check for a fragment, which may be a serialized model to load
const loadFragment = (fragment) => {
};

const state = new State();
if (window.location.hash) {
  try {
    state.deserializeActive(JSON.parse(window.atob(window.location.hash.replace('#', ''))));
    window.location.hash = '';
  } catch (e) {
    console.error('failed to load model from fragment:', e);
  }
}

render(<Editor state={state} />, document.getElementById('app'));
