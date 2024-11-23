import {render} from 'preact';
import {Editor} from './editor';

import './style.css';

render(
  <div style={{display: 'flex'}}>
    <Editor />
  </div>,
  document.getElementById('app'),
);
