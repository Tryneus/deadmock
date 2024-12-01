import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback, useState} from 'preact/hooks';
import PropTypes from 'prop-types';

import {Ability} from './ability';
import {exampleAbility, exampleItem} from './example';
import {Item} from './item';

import './editor.css';

const colors = {
  ability:  '#3399f3',
  weapon:   '#c87a02',
  vitality: '#659818',
  spirit:   '#8b56b4',
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

EditorTypeOption.propTypes = {
  active:  PropTypes.bool,
  color:   PropTypes.string,
  label:   PropTypes.string,
  onClick: PropTypes.func,
};

const Editor = observer(() => {
  const [type, setType] = useState('ability');
  const setAbility = useCallback(() => setType('ability'), [setType]);
  const setItem = useCallback(() => setType('item'), [setType]);

  return (
    <div className="mock-editor">
      <div className="mock-editor-type-selector">
        <div>
          <EditorTypeOption active={type === 'ability'} color={colors.ability} label="Ability" onClick={setAbility} />
          <EditorTypeOption active={type === 'item'} color={colors[exampleItem.category]} label="Item" onClick={setItem} />
        </div>
      </div>
      <div className="mock-editor-content">
        {type === 'ability' ? <Ability model={exampleAbility} /> : null}
        {type === 'item' ? <Item model={exampleItem} /> : null}
      </div>
    </div>
  );
});

Editor.propTypes = {};

export {Editor};
export default Editor;

