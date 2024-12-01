import classNames from 'classnames';
import {useCallback, useState} from 'preact/hooks';
import {observer} from 'mobx-react-lite';
import {Ability} from './ability';
import {exampleAbility, exampleItem} from './example';
import {Item} from './item';
import {AbilityButtons} from './AbilityButtons';
import {ItemButtons} from './ItemButtons';

import './editor.css';

const colors = {
  ability: '#3399f3',
  weapon: '#c87a02',
  vitality: '#659818',
  spirit: '#8b56b4',
};

const EditorTypeOption = ({active, color, label, onClick}) => {
  const classes = classNames('mock-editor-type-option', {
    'mock-editor-type-option-inactive': !active,
  });
  const style = {backgroundColor: color};
  return (
    <div className={classes} style={style} onClick={onClick}>
      {label}
    </div>
  );
};

const Editor = observer(() => {
  const [type, setType] = useState('ability');
  const setAbility = useCallback(() => setType('ability'));
  const setItem = useCallback(() => setType('item'));

  return (
    <div className="mock-editor">
      <div className="mock-editor-type-selector">
        <div>
          <EditorTypeOption active={type === 'ability'} onClick={setAbility} label="Ability" color={colors.ability} />
          <EditorTypeOption active={type === 'item'} onClick={setItem} label="Item" color={colors[exampleItem.category]} />
        </div>
      </div>
      <div className="mock-editor-content">
        {type === 'ability' ? <Ability model={exampleAbility} /> : null}
        {type === 'item' ? <Item model={exampleItem} /> : null}
      </div>
    </div>
  );
});

export {Editor};
export default Editor;

