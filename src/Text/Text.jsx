import classNames from 'classnames';
import PropTypes from 'prop-types';

import './Text.css';

const textColors = ['muted', 'normal', 'bright', 'purple', 'orange'];

const Text = ({italic, weight, color, size, children}) => {
  const colorClass = `mock-text-color-${color}`;
  const classes = classNames(
    'mock-text',
    {
      'mock-text-italic':   italic,
      [colorClass]:         Boolean(color),
      'mock-text-thin':     weight === 400,
      'mock-text-medium':   weight === 500,
      'mock-text-semibold': weight === 600,
      'mock-text-bold':     weight === 700,
    },
  );
  const style = {};
  if (size) {
    style.fontSize = `${size / 20}rem`;
  }
  return (
    <span className={classes} style={style}>
      {children}
    </span>
  );
};

Text.propTypes = {
  italic:   PropTypes.bool,
  weight:   PropTypes.number,
  color:    PropTypes.string,
  size:     PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const Medium = (props) => <Text {...props} weight={500} />;
const SemiBold = (props) => <Text {...props} weight={600} />;
const Bold = (props) => <Text {...props} weight={700} />;

export {Bold, Medium, SemiBold, Text, textColors};
