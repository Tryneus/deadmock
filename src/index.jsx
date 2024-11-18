import {render} from 'preact';
import {Item} from './item';
import {Ability} from './ability';

import './style.css';

render((
  <div style={{display: 'flex'}}>
    <Ability />,
    <Item />
  </div>
), document.getElementById('app'));
