import classNames from 'classnames';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';
import PropTypes from 'prop-types';

import './TooltipContainer.css';

const Tooltip = ({down, click, children, onClose}) => {
  const ref = useRef(null);
  const classes = classNames('mock-tooltip', {
    'mock-tooltip-up':   !down,
    'mock-tooltip-down': down,
  });

  if (click) {
    useEffect(() => {
      const handleClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          onClose();
        }
      };

      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }, [ref, onClose]);
  }

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
};

Tooltip.propTypes = {
  click: PropTypes.bool,
  down:  PropTypes.bool,
};

const TooltipContainer = ({renderTooltip, direction, click, children}) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const down = direction === 'down';

  const onToggle = useCallback(() => {
    setOpen((x) => !x);
  }, [setOpen]);
  const onOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);
  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const cbProps = {};
  if (click) {
    cbProps.onClick = onToggle;
  } else {
    cbProps.onMouseEnter = onOpen;
    cbProps.onMouseLeave = onClose;
  }

  const tooltip = !open ? null : (
    <Tooltip down={down} click={click} onClose={onClose}>
      {renderTooltip()}
    </Tooltip>
  );

  return (
    <div className="mock-tooltip-container">
      <div {...cbProps}>{children}</div>
      {tooltip}
    </div>
  );
};

TooltipContainer.propTypes = {
  renderTooltip: PropTypes.func.isRequired,
  click:         PropTypes.bool,
  direction:     PropTypes.oneOf(['up', 'down']),
};

export {TooltipContainer};
