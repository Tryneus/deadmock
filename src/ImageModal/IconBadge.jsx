import {useCallback} from 'preact/hooks';

import {DoubleClickListener} from '/src/Common';
import {Icon} from '/src/Icon';
import {StoredImage} from '/src/ImageStorage';

const IconBadge = ({id, onChange, onApply}) => {
  const onClick = useCallback(() => onChange(id), [id, onChange]);
  const onDoubleClick = useCallback(() => onApply(id), [id, onApply]);

  return (
    <DoubleClickListener onClick={onClick} onDoubleClick={onDoubleClick}>
      <span className="mock-icon-dialog-image-button">
        <StoredImage id={id}>
          <Icon color="dark-grey" />
        </StoredImage>
      </span>
    </DoubleClickListener>
  );
};

export {IconBadge};
