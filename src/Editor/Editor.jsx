import {saveAs} from 'file-saver';
import {toBlob} from 'html-to-image';
import {observer} from 'mobx-react-lite';
import {useCallback, useRef} from 'preact/hooks';

import {Ability, AbilityModel} from '/src/Ability';
import {isFirefox} from '/src/Common';
import {Item, ItemModel} from '/src/Item';
import {TooltipContainer} from '/src/Tooltip';

import {CopyTextButton} from './CopyTextButton';
import {EditorHistory} from './EditorHistory';
import './Editor.css';

const classBlacklist = [
  'mock-sidebar-buttons',
  'mock-tooltip',
];

const filterClasses = (node) => {
  return !classBlacklist.some((x) => node.classList && node.classList.contains(x));
};

const fileName = (name) => {
  return `${name.replace(/[^A-z0-9]+/, '-')}-${Math.floor(Date.now() / 1000)}`;
};

// Copying image data to the clipboard on firefox is buggy:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1431518
// Provide the user a warning tooltip.
const renderCopyImageButton = (onClick) => {
  const button = (
    <div className="mock-editor-button" onClick={onClick}>
      Copy
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
      <TooltipContainer warning direction="down" renderTooltip={renderTooltip}>
        {button}
      </TooltipContainer>
    );
  }

  return button;
};

const generateBlob = (elem, model) => {
  // target width is 2x((30rem or 23rem) + (2px border))
  const rect = elem.getBoundingClientRect();
  const canvasWidth = model instanceof AbilityModel ? 1204 : 924;
  const canvasHeight = Math.ceil((rect.height + 2) * canvasWidth / (rect.width + 2));

  elem.classList.add('mock-to-image');
  const promise =
    toBlob(elem, {filter: filterClasses, canvasWidth, canvasHeight, pixelRatio: 1})
      .finally(() => elem.classList.remove('mock-to-image'));
  promise.catch((error) => console.error('failed to generate image', error));
  return promise;
};

const Editor = observer(({state}) => {
  const contentRef = useRef(null);

  const onCopyImage = useCallback(() => {
    const blobPromise = generateBlob(contentRef.current, state.activeModel);
    navigator.clipboard.write([new ClipboardItem({'image/png': blobPromise})]);
  }, [contentRef, state]);

  const onSaveImage = useCallback(() =>
    generateBlob(contentRef.current, state.activeModel).then((blob) =>
      saveAs(blob, `${fileName(state.activeModel.name)}.png`),
    ), [contentRef, state]);

  const onCopyLink = useCallback(() => {
    const serialized = state.serializeActive();
    const hash = window.btoa(JSON.stringify(serialized));
    const url = new URL(window.location);
    url.hash = hash;
    const blob = new Blob([url.toString()], {type: 'text/plain'});
    navigator.clipboard.write([new ClipboardItem({'text/plain': blob})]);
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
          Save
        </div>
        <div className="mock-editor-button" onClick={onCopyLink}>
          Copy Link
        </div>
        <CopyTextButton model={state.activeModel} />
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
