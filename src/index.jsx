import {render} from 'preact';
import {Editor} from './Editor';
import {State} from './State';

import './style.css';

const state = new State();
render(<Editor state={state} />, document.getElementById('app'));
