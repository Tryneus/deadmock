import classNames from 'classnames';
import PropTypes from 'prop-types';

import './icon.css';

const Icon = ({image, size, color}) => {
  const classes = classNames('mock-icon', `mock-icon-${color}`);
  const filename = `/deadmock/icon/${image}.png`;
  const style = {};
  if (size) {
    style.lineHeight = `${size}px`;
  }
  return <span className={classes} style={{...style, backgroundImage: `url("${filename}")`}} />;
};

Icon.propTypes = {
  image: PropTypes.string.isRequired,
  size:  PropTypes.number,
  color: PropTypes.string,
};

export {Icon};
export default Icon;
