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
      <Ability model={exampleAbility} />
      <Item model={exampleItem} />
    </div>
  );
};

export {Editor};
export default Editor;

