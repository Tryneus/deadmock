import {render} from 'preact';

import {Editor} from '/src/Editor';
import {State} from '/src/State';
import '/src/preload';
import '/src/style.css';

const state = new State();

const loadFromFragment = () => {
  if (window.location.hash !== '' && window.location.hash !== '#') {
    try {
      state.deserializeActive(JSON.parse(window.atob(window.location.hash.replace('#', ''))));
      window.location.hash = '';
    } catch (e) {
      console.error('failed to load model from fragment:', e);
    }
  }
};

window.addEventListener('hashchange', loadFromFragment);
loadFromFragment();

render(<Editor state={state} />, document.getElementById('app'));
