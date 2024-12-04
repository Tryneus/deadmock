import classNames from 'classnames';
import {toBlob} from 'html-to-image';
import {observer} from 'mobx-react-lite';
import {useCallback, useRef} from 'preact/hooks';
import PropTypes from 'prop-types';

import {Ability, AbilityModel} from '../Ability';
import {Item, ItemModel} from '../Item';
import {EditorHistory} from './EditorHistory';

import './Editor.css';

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

const Editor = observer(({state}) => {
  const contentRef = useRef(null);

  const onCopyImage = useCallback(() => {
    toBlob(contentRef.current, {filter: copyFilter, width: 600})
      .then((blob) => navigator.clipboard.write([new ClipboardItem({'image/png': blob})]))
      .catch((error) => console.error('failed to generate image', error));
  }, [contentRef]);

  const onCopyJSON = useCallback(() => {
    navigator.clipboard.write([new ClipboardItem({'text/plain': JSON.stringify(state.activeModel)})])
      .catch((error) => console.error('failed to copy json', error));
  }, [state]);

  const renderActive = () => {
    if (state.activeModel instanceof AbilityModel) {
      return <Ability model={state.activeModel} />;
    } else if (state.activeModel instanceof ItemModel) {
      return <Item model={state.activeModel} />;
    }
    console.error('unknown model', state.activeModel);
  };

  return (
    <div className="mock-editor">
      <div className="mock-editor-buttons">
        <div className="mock-editor-button" onClick={onCopyImage}>
          Copy Image
        </div>
        <div className="mock-editor-button" onClick={onCopyJSON}>
          Copy JSON
        </div>
        <EditorHistory state={state} />
      </div>
      <div ref={contentRef} className="mock-editor-content">
        {renderActive()}
      </div>
    </div>
  );
});

Editor.propTypes = {};

export {Editor};
