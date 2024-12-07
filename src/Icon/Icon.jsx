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

const hiddenColors = [
  'item-vitality',
  'item-spirit',
  'item-weapon',
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

  return <span
    className={classes}
    style={{backgroundImage: image && `url("/deadmock/icon/${image}.png")`}}
    onClick={onClick}
  />;
};

Icon.propTypes = {
  image:   PropTypes.string,
  large:   PropTypes.bool,
  color:   PropTypes.oneOf(allColors),
  onClick: PropTypes.func,
};

export {Icon, iconColors};
