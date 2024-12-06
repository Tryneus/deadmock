import classNames from 'classnames';
import PropTypes from 'prop-types';

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
const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
const filterType = isFirefox ? 'firefox' : 'default';


const allColors = iconColors.concat(hiddenColors);

const Icon = ({image, size, color, onClick}) => {
  const colorClass = `mock-icon-${color}-${filterType}`;
  const classes = classNames('mock-icon', {
    [colorClass]:          Boolean(color),
    'mock-icon-clickable': Boolean(onClick),
  });

  const style = {};
  if (size) {
    style.fontSize = `${size / 20}rem`;
  }
  if (image) {
    const filename = `/deadmock/icon/${image}.png`;
    style.background = 'transparent';
    style.backgroundImage = `url("${filename}")`;
    style.backgroundSize = 'contain';
    style.backgroundRepeat = 'no-repeat';
    style.backgroundPosition = 'center';
  }

  return <span className={classes} style={style} onClick={onClick} />;
};

Icon.propTypes = {
  image:   PropTypes.string,
  size:    PropTypes.number,
  color:   PropTypes.oneOf(allColors),
  onClick: PropTypes.func,
};

export {Icon, iconColors};
