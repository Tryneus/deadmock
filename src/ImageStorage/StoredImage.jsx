import {cloneElement} from 'preact';
import {useContext, useEffect, useState} from 'preact/hooks';

import {Spinner, isUUID} from '/src/Common';
import {ImageStorageContext, convertToDataUrl} from './ImageStorage';
import './StoredImage.css';

// 'id' may be the UUID of a stored image, or it may be the path to an image.
// If it is a UUID, a spinner will be displayed until the image data has been
// loaded, at which point the data url will be passed in the 'image' prop to
// the child element.
const StoredImage = ({children, id}) => {
  const imageStorage = useContext(ImageStorageContext);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (isUUID(id)) {
      imageStorage._cache.retrieve(id)
        .then((obj) => convertToDataUrl(obj.file))
        .then((dataUrl) => setImageData(dataUrl))
        .catch((err) => {
          setImageData('error');
          console.error('error loading image file', err);
        });
    } else {
      setImageData(null);
    }
  }, [id, imageStorage, setImageData]);

  const image = isUUID(id) ? imageData : id;
  const contents = isUUID(id) && !imageData ?
    <Spinner color={children.props.color} /> :
    cloneElement(children, {image});

  return (
    <span className="mock-stored-image">
      {contents}
    </span>
  );
};

export {StoredImage};
