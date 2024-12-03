import classNames from 'classnames';
import {useCallback} from 'preact/hooks';
import PropTypes from 'prop-types';

import {Icon} from '../Icon';
import {allItems} from '../Common';

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

const tiers = [1, 2, 3, 4];
const byCategory = Object.groupBy(allItems, (x) => x.category);
const groups =
  Object.fromEntries(
    Object.entries(byCategory)
      .map(([c, list]) =>
        [c, Object.groupBy(list, (x) => x.tier)]
      )
  );

// Sort tiers as they are in the game, inactive before active, then alphabetically
Object.values(groups).forEach((group) => Object.values(group).forEach((tier) =>
  tier.sort((a, b) => {
    if (a.active < b.active) {
      return -1;
    } else if (a.active > b.active) {
      return 1;
    } else if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    }
    return 0;
  }),
));

const ItemPicker = ({onChange}) => {
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
