import {observer} from 'mobx-react-lite';
import {Ability} from './ability';
import {exampleAbility, exampleItem} from './example';
import {Item} from './item';

import './editor.css';

const Editor = observer(() => {
  return (
    <div className="mock-editor">
      <Ability model={exampleAbility} />
      <Item model={exampleItem} />
    </div>
  );
});

export {Editor};
export default Editor;

