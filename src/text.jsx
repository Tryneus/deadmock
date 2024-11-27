import classNames from 'classnames';
import PropTypes from 'prop-types';

import './text.css';

const Text = ({bright, muted, italic, weight, color, size, children}) => {
  const classes = classNames(
    'mock-text',
    {
      'mock-text-bright':   bright,
      'mock-text-muted':    muted,
      'mock-text-italic':   italic,
    },
  );
  const style = {};
  if (color) {
    style.color = color;
  }
  if (size) {
    style.fontSize = `${size}px`;
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
  bright:   PropTypes.bool,
  muted:    PropTypes.bool,
  italic:   PropTypes.bool,
  weight:   PropTypes.number,
  color:    PropTypes.string,
  size:     PropTypes.number,
  children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
  ]),
};

const Medium = (props) => <Text {...props} weight={500} />;
const SemiBold = (props) => <Text {...props} weight={600} />;
const Bold = (props) => <Text {...props} weight={700} />;

export {Bold, Medium, SemiBold, Text};
