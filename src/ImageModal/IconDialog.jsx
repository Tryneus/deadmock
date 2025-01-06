import {useCallback, useState} from 'preact/hooks';

import {abilityIconsByHero, groupedItems, groupedStatIcons} from '/src/Common';
import {Icon} from '/src/Icon';
import {StoredImage} from '/src/ImageStorage';
import {CustomGallery} from './CustomGallery';
import {ImageModalHeader} from './Header';
import {IconBadge} from './IconBadge';
import {StaticGallery} from './StaticGallery';

// Each of these is s a 2d array consisting of logical groups of icons
const staticImageGroups = {
  ability: Object.values(abilityIconsByHero),
  item:    Object.values(groupedItems).map((tiers) =>
    [1, 2, 3, 4].map((tier) => tiers[tier].map((x) => x.icon)),
  ).flat(),
  other:   groupedStatIcons,
};

const allModes = Object.keys(staticImageGroups).concat(['custom']);

const initialMode = (image) =>
  Object.entries(staticImageGroups).filter(
    ([, groups]) => groups.some((group) => group.includes(image)),
  ).map(([k]) => k)[0] || 'custom';

const IconDialog = ({image, onChange, onClose}) => {
  const [display, setDisplay] = useState(image);
  const [mode, setMode] = useState(() => initialMode(image));
  const onChangeMode = useCallback((x) => setMode(x), [setMode]);
  const onCancel = useCallback(() => {
    onClose();
  }, [onClose]);
  const onApply = useCallback(() => {
    onChange(display);
  }, [display, onChange]);
  const onApplyDirect = useCallback((id) => {
    onChange(id);
  }, [onChange]);

  const renderGallery = () => {
    if (mode === 'custom') {
      return <CustomGallery component={IconBadge} type="icon" onApply={onApplyDirect} onChange={setDisplay} />;
    }
    return <StaticGallery groups={staticImageGroups[mode]} onApply={onApplyDirect} onChange={setDisplay} />;
  };

  return (
    <div className="mock-image-modal">
      <ImageModalHeader active={mode} modes={allModes} onChange={onChangeMode} />
      <div className="mock-image-modal-body">
        <div className="mock-left-scroll">
          <div key={mode} className="mock-icon-dialog-images">
            {renderGallery()}
          </div>
        </div>
        <div className="mock-image-dialog-preview">
          <div className="mock-image-dialog-preview-icon">
            <StoredImage key={display} id={display}>
              <Icon color="dark-grey" />
            </StoredImage>
          </div>
        </div>
      </div>
      <div className="mock-image-modal-footer">
        <div className="mock-image-modal-cancel" onClick={onCancel}>Cancel</div>
        <div className="mock-image-modal-apply" onClick={onApply}>Apply</div>
      </div>
    </div>
  );
};

export {IconDialog};
