import {saveAs} from 'file-saver';
import {toBlob} from 'html-to-image';
import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useRef} from 'preact/hooks';

import {Ability} from '/src/Ability';
import {isFirefox, itemCategories, useAction} from '/src/Common';
import {Hero} from '/src/Hero';
import {Item} from '/src/Item';
import {latestVersion} from '/src/Serialize';
import {TooltipContainer} from '/src/Tooltip';

import {CopyTextButton} from './CopyTextButton';
import {EditorHistory} from './EditorHistory';
import './Editor.css';

const classBlacklist = [
  'mock-sidebar-buttons',
  'mock-tooltip',
  'mock-hero-ability-display-hidden',
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

const categoryWidths = {
  ability:  1204,
  weapon:   924,
  vitality: 924,
  spirit:   924,
  hero:     2004,
};

const generateBlob = (elem, model) => {
  // target width is 2x((30rem or 23rem) + (2px border))
  const rect = elem.getBoundingClientRect();
  const canvasWidth = categoryWidths[model.category] || 924;
  const canvasHeight = Math.ceil(rect.height * canvasWidth / rect.width);

  elem.classList.add('mock-to-image');
  const promise =
    toBlob(elem, {filter: filterClasses, canvasWidth, canvasHeight, pixelRatio: 1})
      .finally(() => elem.classList.remove('mock-to-image'));
  promise.catch((error) => console.error('failed to generate image', error));
  return promise;
};

const Editor = observer(({state}) => {
  const contentRef = useRef(null);
  const {category, name} = state.activeModel || {};

  const onCopyImage = useCallback(() => {
    const blobPromise = generateBlob(contentRef.current, state.activeModel);
    navigator.clipboard.write([new ClipboardItem({'image/png': blobPromise})]);
  }, [contentRef, state]);

  const onSaveImage = useCallback(() =>
    generateBlob(contentRef.current, state.activeModel).then((blob) =>
      saveAs(blob, `${fileName(state.activeModel.name)}.png`),
    ), [contentRef, state]);

  const onCopyLink = useCallback(() => {
    const serialized = [latestVersion, state.activeModel.serialize()];
    const hash = window.btoa(JSON.stringify(serialized));
    const url = new URL(window.location);
    url.hash = hash;
    const blob = new Blob([url.toString()], {type: 'text/plain'});
    navigator.clipboard.write([new ClipboardItem({'text/plain': blob})]);
  }, [state]);

  const onChangeModel = useAction((id) => {
    state.loadRecord(id);
  }, [state]);

  useEffect(() => {
    if (name) {
      document.title = `${name} - Deadmock`;
    }
  }, [name]);

  const renderActive = () => {
    if (category === 'ability') {
      return <Ability model={state.activeModel} />;
    } else if (category === 'hero') {
      return <Hero model={state.activeModel} onChangeModel={onChangeModel} />;
    } else if (itemCategories.includes(category)) {
      return <Item model={state.activeModel} />;
    }
    return null;
  };

  // Conditionally render the 'Copy Link' button because we don't have a way to
  // transfer custom icons or hero portrait over a link - we only have a
  // static server.
  const copyLinkButton = (
    <div className="mock-editor-button" onClick={onCopyLink}>
      Copy Link
    </div>
  );

  return (
    <div className="mock-editor">
      <div className="mock-editor-buttons">
        {renderCopyImageButton(onCopyImage)}
        <div className="mock-editor-button" onClick={onSaveImage}>
          Save
        </div>
        {category === 'hero' ? null : copyLinkButton}
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
