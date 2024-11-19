import {Item} from './item';
import {Ability} from './ability';
import {exampleItem, exampleAbility} from './example';

import './editor.css';

const Editor = () => {
  return (
    <div className="mock-editor">
      <Ability data={exampleAbility} />
      <Item data={exampleItem} />
    </div>
  );
};

export {Editor};
export default Editor;

