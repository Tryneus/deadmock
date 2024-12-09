import classNames from 'classnames';

import {Icon} from '../Icon';

import './Deleteable.css';

const Deleteable = ({children, onClick, overlap}) => {
  const buttonClasses = classNames('mock-delete-button', {
    'mock-delete-button-overlap': overlap,
  });

  return (
    <div className="mock-deleteable">
      {children}
      <span className={buttonClasses}>
        <Icon color="red" image="cancel" onClick={onClick} />
      </span>
    </div>
  );
};

export {Deleteable};
