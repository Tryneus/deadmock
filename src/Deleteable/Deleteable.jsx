import classNames from 'classnames';

import {Icon} from '/src/Icon';

import './Deleteable.css';

const Deleteable = ({children, onMouseDown, overlap}) => {
  const overlapClass = classNames({'mock-delete-button-overlap': overlap});

  return (
    <div className="mock-deleteable">
      {children}
      <span>
        <span className={overlapClass}>
          <span className="mock-delete-button">
            <Icon color="red" image="cancel" onMouseDown={onMouseDown} />
          </span>
        </span>
      </span>
    </div>
  );
};

export {Deleteable};
