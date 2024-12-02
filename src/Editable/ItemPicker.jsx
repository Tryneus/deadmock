import classNames from 'classnames';
import {useCallback} from 'preact/hooks';
import PropTypes from 'prop-types';

import {Icon} from '../Icon';

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

ItemPickerItem.propTypes = {
  item:     PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

const ItemPicker = ({onChange}) => {
  const byCategory = Object.groupBy(allItems, (x) => x.category);
  const groups = Object.fromEntries(Object.entries(byCategory).map(([c, list]) => [c, Object.groupBy(list, (x) => x.tier)]));
  const tiers = [1, 2, 3, 4];

  const renderTier = (items) => (
    <div className="mock-item-picker-tier">
      {items.map((x) => <ItemPickerItem key={x.name} item={x} onChange={onChange} />)}
    </div>
  );

  return (
    <div className="mock-item-picker">
      <div className="mock-item-picker-weapon-group">
        {tiers.map((tier) => renderTier(groups.weapon[tier]))}
      </div>
      <div className="mock-item-picker-vitality-group">
        {tiers.map((tier) => renderTier(groups.vitality[tier]))}
      </div>
      <div className="mock-item-picker-spirit-group">
        {tiers.map((tier) => renderTier(groups.spirit[tier]))}
      </div>
    </div>
  );
};

ItemPicker.propTypes = {
  onChange: PropTypes.func,
};

export {ItemPicker};
