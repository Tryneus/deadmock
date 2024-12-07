import classNames from 'classnames';
import PropTypes from 'prop-types';

import {isFirefox} from '../Common';
import './Icon.css';

const iconColors = [
  'white',
  'grey',
  'orange',
  'green',
  'purple',
  'aqua',
  'red',
  'yellow',
  'cyan',
];

// Icon colors that users can't really put to use
const hiddenColors = [
  'bright-green',  // Used for sidebar button '+' icon
  'item-spirit',   // Used for the inner color of spirit item icons
  'item-vitality', // Used for the inner color of vitality item icons
  'item-weapon',   // Used for the inner color of weapon item icons
];

// Firefox implements filter css rules differently from chrome, haven't tested
// other browsers but since they're mostly webkit-based, use the chrome settings
// as default.  Also, results can be confusing because different browsers may
// use different color profiles, so good luck.
const filterType = isFirefox ? 'firefox' : 'default';

const allColors = iconColors.concat(hiddenColors);

const Icon = ({image, large, color, onClick}) => {
  const colorClass = `mock-icon-${color}-${filterType}`;
  const classes = classNames('mock-icon', {
    [colorClass]:          Boolean(color),
    'mock-icon-clickable': Boolean(onClick),
    'mock-icon-image':     Boolean(image),
    'mock-icon-large':     Boolean(large),
  });

  return (
    <span
      className={classes}
      style={{backgroundImage: image && `url("/deadmock/icon/${image}.png")`}}
      onClick={onClick}
    />
  );
};

Icon.propTypes = {
  image:   PropTypes.string,
  large:   PropTypes.bool,
  color:   PropTypes.oneOf(allColors),
  onClick: PropTypes.func,
};

export {Icon, iconColors};
