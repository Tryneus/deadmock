import classNames from 'classnames';
import PropTypes from 'prop-types';

import './icon.css';

const iconColors = ['white', 'grey', 'orange', 'green', 'purple', 'aqua', 'red', 'yellow', 'cyan'];

const Icon = ({image, size, color}) => {
  const colorClass = `mock-icon-${color}`;
  const classes = classNames('mock-icon', {
    [colorClass]: Boolean(color),
  });

  const style = {};
  if (size) {
    style.lineHeight = `${size}px`;
  }
  if (image) {
    const filename = `/deadmock/icon/${image}.png`;
    style.background = 'transparent';
    style.backgroundImage = `url("${filename}")`;
    style.backgroundSize = 'contain';
    style.backgroundRepeat = 'no-repeat';
    style.backgroundPosition = 'center';
  }

  return <span className={classes} style={style} />;
};

Icon.propTypes = {
  image: PropTypes.string,
  size:  PropTypes.number,
  color: PropTypes.oneOf(iconColors),
};

export {Icon, iconColors};
export default Icon;
