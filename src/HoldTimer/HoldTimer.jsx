import classNames from 'classnames';
import {useCallback, useState} from 'preact/hooks';

import {Icon} from '/src/Icon';
import './HoldTimer.css';

const HoldTimer = ({children, duration, image, iconColor, onComplete}) => {
  const [timer, setTimer] = useState(null);

  const onMouseDown = useCallback(() => {
    setTimer((oldTimer) => {
      clearTimeout(oldTimer);
      return setTimeout(onComplete, duration);
    });
  }, [duration, onComplete, setTimer]);

  const onCancel = useCallback(() => {
    setTimer((oldTimer) => {
      clearTimeout(oldTimer);
      return null;
    });
  }, [setTimer]);

  const classes = classNames(
    'mock-hold-timer-icon',
    {'mock-hold-timer-icon-animating': Boolean(timer)},
  );

  const style = {animationDuration: `${duration}ms`};

  return (
    <div className="mock-hold-timer" onMouseDown={onMouseDown} onMouseLeave={onCancel} onMouseUp={onCancel}>
      <div>
        {children}
      </div>
      <div className={classes}>
        <div className="mock-hold-timer-circle" style={style}>
          <svg viewBox="0 0 36 36">
            <circle cx="18" cy="18" fill="none" r="15.91" stroke="white" transform="rotate(-90, 18 18)" />
          </svg>
        </div>
        <Icon color={iconColor} image={image} />
      </div>
    </div>
  );
};

export {HoldTimer};
