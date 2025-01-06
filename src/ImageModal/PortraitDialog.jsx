import {useCallback, useState} from 'preact/hooks';

import {DoubleClickListener} from '/src/Common';
import {Portrait} from '/src/Hero/Portrait';
import {CustomGallery} from './CustomGallery';
import {ImageModalHeader} from './Header';

const PortraitButton = ({id, onChange, onApply}) => {
  const onClick = useCallback(() => onChange(id), [id, onChange]);
  const onDoubleClick = useCallback(() => onApply(id), [id, onApply]);

  return (
    <DoubleClickListener onClick={onClick} onDoubleClick={onDoubleClick}>
      <div className="mock-portrait-button">
        <Portrait id={id} />
      </div>
    </DoubleClickListener>
  );
};

const portraitMode = 'Custom Portrait';
const PortraitDialog = ({image, onChange, onClose}) => {
  const [display, setDisplay] = useState(image);
  const onCancel = useCallback(() => {
    onClose();
  }, [onClose]);
  const onApply = useCallback(() => {
    onChange(display);
  }, [display, onChange]);
  const onApplyDirect = useCallback((id) => {
    onChange(id);
  }, [onChange]);

  return (
    <div className="mock-image-modal">
      <ImageModalHeader active={portraitMode} modes={[portraitMode]} />
      <div className="mock-image-modal-body">
        <div className="mock-left-scroll">
          <div className="mock-portrait-dialog-images">
            <CustomGallery component={PortraitButton} type="portrait" onApply={onApplyDirect} onChange={setDisplay} />
          </div>
        </div>
        <div key={display} className="mock-image-dialog-preview">
          <Portrait id={display} />
        </div>
      </div>
      <div className="mock-image-modal-footer">
        <div className="mock-image-modal-cancel" onClick={onCancel}>Cancel</div>
        <div className="mock-image-modal-apply" onClick={onApply}>Apply</div>
      </div>
    </div>
  );
};

export {PortraitDialog};
