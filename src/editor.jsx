import {useCallback} from 'preact/hooks';
import {observer} from 'mobx-react-lite';
import {Item} from './item';
import {Ability} from './ability';
import {exampleItem, exampleAbility} from './example';

import './editor.css';

const Editor = () => {
  const onClick = useCallback(() => exampleAbility.grid.addCell(), [exampleAbility]);

  return (
    <div className="mock-editor">
      <button onClick={onClick}>+</button>
      <Ability data={exampleAbility} />
      <Item data={exampleItem} />
    </div>
  );
};

export {Editor};
export default Editor;

