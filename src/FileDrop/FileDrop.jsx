import classNames from 'classnames';
import {useCallback, useContext, useState} from 'preact/hooks';

import {ImageStorageContext} from '/src/ImageStorage';
import './FileDrop.css';

const FileDrop = ({children, onDrop, type}) => {
  const [dragging, setDragging] = useState(false);
  const imageStorage = useContext(ImageStorageContext);

  const onDropWrapper = useCallback((ev) => {
    // No use case for multiple file uploads, so just take the first
    const item = ev.dataTransfer.items[0];
    ev.preventDefault();

    if (item.kind === 'file') {
      imageStorage[type].store(item.getAsFile())
        .then(onDrop)
        .catch((err) => console.error('failed to store file', err));
    }
    setDragging(false);
  }, [imageStorage, type, onDrop, setDragging]);

  const onDragOver = useCallback((ev) => {
    ev.preventDefault();
  }, []);

  const onDragEnter = useCallback(() => {
    setDragging(true);
  }, [setDragging]);

  const onDragLeave = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

  const iconClasses = classNames('mock-file-drop-zone-icon', {'mock-file-drop-zone-icon-hover': dragging});

  return (
    <div className="mock-file-drop-zone" >
      <div
        className={iconClasses}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDropWrapper}
      />
      {children}
    </div>
  );
};

export {FileDrop};
