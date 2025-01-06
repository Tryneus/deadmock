import {useCallback, useContext, useEffect, useState} from 'preact/hooks';

import {HoldTimer} from '/src/HoldTimer';
import {ImageStorageContext} from '/src/ImageStorage';

// Include portraits we have server-side
const defaultImages = {
  portrait: ['dynamo.webp'],
};

const UploadButton = ({onUpload, type}) => {
  const imageStorage = useContext(ImageStorageContext);
  const onCancel = useCallback((ev) => {
    ev.stopPropagation();
  }, []);
  const onChange = useCallback((ev) => {
    ev.stopPropagation();
    Promise.all(Array.from(ev.target.files).map((file) => {
      return imageStorage[type].store(file);
    })).then((ids) => {
      onUpload(ids[0]);
    }).catch((err) => console.error('failed to store selected files', err));
  }, [imageStorage, type, onUpload]);

  return (
    <div className="mock-image-dialog-upload">
      <label htmlFor="image-upload">Select File…</label>
      <input
        multiple
        accept="image/*"
        id="image-upload"
        name="image-upload"
        type="file"
        onCancel={onCancel} /* eslint-disable-line react/no-unknown-property */
        onChange={onChange}
      />
    </div>
  );
};

const DeleteableImage = ({id, children, onDelete}) => {
  const onClick = useCallback(() => onDelete(id), [id, onDelete]);
  return (
    <div className="mock-image-modal-deleteable">
      <HoldTimer duration={1000} iconColor="red" image="cancel" onComplete={onClick} />
      {children}
    </div>
  );
};

const CustomGallery = ({type, component, onChange, onApply}) => {
  const Component = component;
  const [ids, setIds] = useState([]);
  const imageStorage = useContext(ImageStorageContext);
  const onUpload = useCallback((id) => {
    onChange(id);
    imageStorage[type].list().then((arr) => setIds(arr));
  }, [type, setIds, onChange, imageStorage]);
  const onDelete = useCallback((id) => {
    imageStorage[type].remove(id).then(() =>
      imageStorage[type].list().then((arr) => setIds(arr)),
    );
  }, [type, setIds, imageStorage]);
  useEffect(() => {
    imageStorage[type].list().then((arr) => setIds(arr));
  }, [type, setIds, imageStorage]);

  const defaultIds = defaultImages[type] || [];
  return (
    <>
      <UploadButton type={type} onUpload={onUpload} />
      {ids.map((id) => (
        <DeleteableImage key={id} id={id} onDelete={onDelete}>
          <Component id={id} onApply={onApply} onChange={onChange} />
        </DeleteableImage>
      ))}
      {defaultIds.map((id) =>
        <Component key={id} id={id} onApply={onApply} onChange={onChange} />,
      )}
    </>
  );
};

export {CustomGallery};
