import classNames from 'classnames';
import PropTypes from 'prop-types';

import './Text.css';

const textColors = {
  bright: '#ffefd7',
  normal: '#c8c6ca',
  muted:  '#968291',
  purple: '#c78bf7',
  orange: '#ed961e',
};

const Text = ({italic, weight, color, size, children}) => {
  const classes = classNames(
    'mock-text',
    {
      'mock-text-italic':   italic,
    },
  );
  const style = {};
  if (textColors[color]) {
    style.color = textColors[color];
  }
  if (size) {
    style.fontSize = `${size / 20}rem`;
  }
  if (weight) {
    style.fontWeight = weight;
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
