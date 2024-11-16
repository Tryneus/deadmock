import classNames from 'classnames';

import './icon.css';

const Icon = ({style, icon, small}) => {
  const classes = classNames('mock-icon', {'mock-icon-small': small});
  const filename = '/icon/' + icon + (icon.includes('.') ? '' : '.png');
  return <span className={classes} style={{...style, backgroundImage: `url("${filename}")`}} />;
};

export {Icon};
export default Icon;
