import classNames from 'classnames';
import PropTypes from 'prop-types';

import './text.css';

const Text = ({bright, muted, italic, variant, color, size, children}) => {
  const classes = classNames(
    'mock-text',
    {
      'mock-text-bright':   bright,
      'mock-text-muted':    muted,
      'mock-text-italic':   italic,
      'mock-text-medium':   variant === 'medium',
      'mock-text-semibold': variant === 'semibold',
      'mock-text-bold':     variant === 'bold',
    },
  );
  const style = {color, fontSize: `${size}px`};
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
  variant:  PropTypes.string,
  color:    PropTypes.string,
  size:     PropTypes.number,
  children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
  ]),
};

const Medium = (props) => <Text {...props} variant="medium" />;
const SemiBold = (props) => <Text {...props} variant="semibold" />;
const Bold = (props) => <Text {...props} variant="bold" />;

export {Bold, Medium, SemiBold, Text};
