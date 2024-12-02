import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';
import PropTypes from 'prop-types';

import './TooltipContainer.css';

const TooltipContainer = observer(({renderTooltip, direction, click, children}) => {
  const ref = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const down = direction === 'down';

  const arrowClasses = classNames({
    'mock-tooltip-arrow-up':   !down,
    'mock-tooltip-arrow-down': down,
  });

  const tooltipClasses = classNames('mock-tooltip', {
    'mock-tooltip-up':   !down,
    'mock-tooltip-down': down,
  });

  const addArrow = useCallback((elem) => (
    <>
      {!down && elem}
      <div className={arrowClasses} />
      {down && elem}
    </>
  ), [down, arrowClasses]);

  const cbProps = {};
  if (click) {
    cbProps.onClick = useCallback(() => {
      if (tooltip) {
        setTooltip(null);
      } else {
        setTooltip(addArrow(renderTooltip()));
      }
    }, [tooltip, renderTooltip, addArrow]);

    useEffect(() => {
      const handleClick = (e) => {
        if (tooltip && ref.current && !ref.current.contains(e.target)) {
          setTooltip(null);
        }
      };

      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }, [tooltip, setTooltip, ref]);
  } else {
    cbProps.onMouseEnter = useCallback(() => {
      setTooltip(addArrow(renderTooltip()));
    }, [addArrow, renderTooltip, setTooltip]);

    cbProps.onMouseLeave = useCallback(() => {
      setTooltip(null);
    }, [setTooltip]);
  }

  return (
    <div ref={ref} className="mock-tooltip-container" {...cbProps} >
      {down && children}
      <div className={tooltipClasses}>
        {tooltip}
      </div>
      {!down && children}
    </div>
  );
});

TooltipContainer.propTypes = {
  renderTooltip: PropTypes.func.isRequired,
  click:         PropTypes.bool,
  direction:     PropTypes.oneOf(['up', 'down']),
};

export {TooltipContainer};
