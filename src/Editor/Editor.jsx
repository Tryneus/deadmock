import classNames from 'classnames';
import {saveAs} from 'file-saver';
import {toBlob, toCanvas} from 'html-to-image';
import {observer} from 'mobx-react-lite';
import {useCallback, useRef} from 'preact/hooks';
import PropTypes from 'prop-types';

import {Ability, AbilityModel} from '../Ability';
import {isFirefox} from '../Common';
import {TooltipContainer} from '../Editable';
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

const fileName = (name) => {
  return `${name.replace(/[^A-z0-9]+/,'-')}-${Math.floor(Date.now() / 1000)}`;
};

// Copying image data to the clipboard on firefox is buggy:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1431518
// Provide the user a warning tooltip.
const renderCopyImageButton = (onClick) => {
  const button = (
    <div className="mock-editor-button" onClick={onClick}>
      Copy Image
    </div>
  );

  if (isFirefox) {
    const renderTooltip = () => (
      <div className="mock-editor-warning">
        Copying image data to the clipboard is buggy on Firefox and may slightly alter colors.
        <b> Take a screenshot </b>
        or
        <b> save as an image </b>
        to avoid this problem.
      </div>
    );
    return (
      <TooltipContainer direction="down" renderTooltip={renderTooltip}>
        {button}
      </TooltipContainer>
    );
  }

  return button;
};

const Editor = observer(({state}) => {
  const contentRef = useRef(null);

  const onCopyImage = useCallback(() => {
    contentRef.current.classList.add('mock-to-image');
    toBlob(contentRef.current, {filter: copyFilter, pixelRatio: 2})
      .finally(() => contentRef.current.classList.remove('mock-to-image'))
      .then((blob) => navigator.clipboard.write([new ClipboardItem({'image/png': blob})]))
      .catch((error) => console.error('failed to generate image', error));
  }, [contentRef]);

  const onSaveImage = useCallback(() => {
    contentRef.current.classList.add('mock-to-image');
    toBlob(contentRef.current, {filter: copyFilter, pixelRatio: 2})
      .finally(() => contentRef.current.classList.remove('mock-to-image'))
      .then((blob) => saveAs(blob, `${fileName(state.activeModel.name)}.png`))
      .catch((error) => console.error('failed to generate image', error));
  }, []);

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
        {renderCopyImageButton(onCopyImage)}
        <div className="mock-editor-button" onClick={onSaveImage}>
          Save Image
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
