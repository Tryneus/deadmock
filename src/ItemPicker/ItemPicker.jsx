import classNames from 'classnames';
import {useCallback} from 'preact/hooks';

import {groupedItems} from '/src/Common';
import {Icon} from '/src/Icon';

import './ItemPicker.css';

const ItemPickerItem = ({item, onChange}) => {
  const onClick = useCallback(() => onChange(item), [item, onChange]);
  const classes = classNames(`mock-item-picker-icon-${item.category}`);
  const iconColor = `item-${item.category}`;

  return (
    <div className={classes} onClick={onClick} >
      <Icon color={iconColor} image={item.icon} />
    </div>
  );
};

const tiers = [1, 2, 3, 4];

const ItemPicker = ({onChange}) => {
  const renderTier = (items) => (
    <div className="mock-item-picker-tier">
      {items.map((x) => <ItemPickerItem key={x.name} item={x} onChange={onChange} />)}
    </div>
  );

  return (
    <div className="mock-item-picker">
      <div className="mock-item-picker-weapon-group">
        {tiers.map((tier) => renderTier(groupedItems.weapon[tier]))}
      </div>
      <div className="mock-item-picker-vitality-group">
        {tiers.map((tier) => renderTier(groupedItems.vitality[tier]))}
      </div>
      <div className="mock-item-picker-spirit-group">
        {tiers.map((tier) => renderTier(groupedItems.spirit[tier]))}
      </div>
    </div>
  );
};

export {ItemPicker};
