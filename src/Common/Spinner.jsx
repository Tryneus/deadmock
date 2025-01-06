import classNames from 'classnames';

import './Spinner.css';

// Spinner styling from https://loading.io/css/
const Spinner = ({color}) => {
  const colorClass = `mock-spinner-${color}`;
  const classes = classNames('mock-spinner', {[colorClass]: Boolean(color)});

  return (
    <div className={classes}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export {Spinner};
