import {observer} from 'mobx-react-lite';
import {Ability} from './ability';
import {exampleAbility, exampleItem} from './example';
import {Item} from './item';
import {AbilityButtons} from './AbilityButtons';
import {ItemButtons} from './ItemButtons';

import './editor.css';

const Editor = observer(() => {
  return (
    <div className="mock-editor">
      <AbilityButtons model={exampleAbility} />
      <Ability model={exampleAbility} />
      <Item model={exampleItem} />
      <ItemButtons model={exampleItem} />
    </div>
  );
});

export {Editor};
export default Editor;

