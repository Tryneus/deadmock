import {useCallback, useEffect, useRef, useState} from 'preact/hooks';

import {clickInsideElement} from '/src/Common';
import {FileDrop} from '/src/FileDrop';
import {IconDialog} from './IconDialog';
import {PortraitDialog} from './PortraitDialog';
import './ImageModal.css';

const ImageModal = ({image, onClose, onChange, type}) => {
  const ref = useRef();
  const onClick = useCallback((ev) => {
    ev.stopPropagation();
    if (ref.current && !clickInsideElement(ref.current, ev)) {
      onClose();
    }
  }, [ref, onClose]);

  useEffect(() => {
    const {current} = ref;
    if (current) {
      current.showModal();
      return () => current.close();
    }
  }, [ref]);

  const contents = type === 'icon' ?
    <IconDialog image={image} onChange={onChange} onClose={onClose} /> :
    <PortraitDialog image={image} onChange={onChange} onClose={onClose} />;

  return (
    <dialog ref={ref} className="mock-image-dialog" onCancel={onClose} onClick={onClick}>
      {contents}
    </dialog>
  );
};

const ImageModalTrigger = ({children, image, onChange, type}) => {
  const [show, setShow] = useState(false);
  const onOpen = useCallback(() => setShow(true), [setShow]);
  const onClose = useCallback(() => setShow(false), [setShow]);
  const onChangeWrapped = useCallback((data) => {
    setShow(false);
    onChange(data);
  }, [setShow, onChange]);

  return (
    <div className="mock-image-modal-trigger" onClick={onOpen}>
      <div className="mock-image-modal-overlay" />
      {show && <ImageModal image={image} type={type} onChange={onChangeWrapped} onClose={onClose} />}
      <FileDrop type={type} onDrop={onChange}>
        {children}
      </FileDrop>
    </div>
  );
};

export {ImageModal, ImageModalTrigger};
