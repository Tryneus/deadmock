import classNames from 'classnames';
import {toBlob} from 'html-to-image';
import {observer} from 'mobx-react-lite';
import {useCallback, useRef, useState} from 'preact/hooks';
import PropTypes from 'prop-types';

import {Ability} from '../Ability';
import {Item} from '../Item';
import {exampleAbility, exampleItem} from '../example';

import './Editor.css';

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

const copyClassBlacklist = [
  'mock-sidebar-buttons',
  'mock-tooltip',
];

const copyFilter = (node) => {
  return !copyClassBlacklist.some((x) => node.classList && node.classList.contains(x));
};

const Editor = observer(() => {
  const contentRef = useRef(null);
  const [type, setType] = useState('ability');
  const setAbility = useCallback(() => setType('ability'), [setType]);
  const setItem = useCallback(() => setType('item'), [setType]);

  const onCopyImage = useCallback(() => {
    toBlob(contentRef.current, {filter: copyFilter, width: 600})
      .then((blob) => navigator.clipboard.write([new ClipboardItem({'image/png': blob})]))
      .catch((error) => console.error('failed to generate image', error));
  }, [contentRef]);

  const onCopyJSON = useCallback(() => {
    const obj = type === 'ability' ? exampleAbility : exampleItem;
    navigator.clipboard.write([new ClipboardItem({'text/plain': JSON.stringify(obj)})])
      .catch((error) => console.error('failed to copy json', error));
  }, [type]);

  return (
    <div className="mock-editor">
      <div className="mock-editor-type-selector">
        <div>
          <EditorTypeOption active={type === 'ability'} color={colors.ability} label="Ability" onClick={setAbility} />
          <EditorTypeOption active={type === 'item'} color={colors[exampleItem.category]} label="Item" onClick={setItem} />
        </div>
      </div>
      <div className="mock-editor-buttons">
        <div className="mock-editor-button" onClick={onCopyImage}>
          Copy Image
        </div>
        <div className="mock-editor-button" onClick={onCopyJSON}>
          Copy JSON
        </div>
      </div>
      <div ref={contentRef} className="mock-editor-content">
        {type === 'ability' ? <Ability model={exampleAbility} /> : null}
        {type === 'item' ? <Item model={exampleItem} /> : null}
      </div>
    </div>
  );
});

Editor.propTypes = {};

export {Editor};
