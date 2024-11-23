import classNames from 'classnames';

import './icon.css';

const colorClasses = {
  grey: 'mock-icon-grey',
  purple: 'mock-icon-purple',
  green: 'mock-icon-green',
  orange: 'mock-icon-orange',
};

const colorToClassName = (color) => color && colorClasses[color];

const Icon = ({image, size, color}) => {
  const classes = classNames('mock-icon', colorToClassName(color));
  const filename = `/deadmock/icon/${image}.png`;
  const style = {};
  if (size) {
    style.lineHeight = `${size}px`;
  }
  return <span className={classes} style={{...style, backgroundImage: `url("${filename}")`}} />;
};

export {Icon};
export default Icon;
