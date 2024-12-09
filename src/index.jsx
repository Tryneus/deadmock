import {render} from 'preact';
import {Editor} from './Editor';
import {State} from './State';

import './style.css';

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
