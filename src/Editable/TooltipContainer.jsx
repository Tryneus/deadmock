import classNames from 'classnames';
import {useCallback, useEffect, useRef, useState} from 'preact/hooks';
import PropTypes from 'prop-types';

import './TooltipContainer.css';

const Tooltip = ({down, click, children, warning, onClose}) => {
  const ref = useRef(null);
  const classes = classNames('mock-tooltip', {
    'mock-tooltip-up':      !down,
    'mock-tooltip-down':    down,
    'mock-tooltip-warning': warning,
  });

  useEffect(() => {
    const handleClick = (e) => {
      if (click && ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [click, ref, onClose]);

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  click:   PropTypes.bool,
  down:    PropTypes.bool,
  onClose: PropTypes.func,
  warning: PropTypes.bool,
};

const TooltipContainer = ({renderTooltip, direction, click, children, warning}) => {
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

  const tooltip = () => {
    if (!open) {
      return null;
    }

    return (
      <Tooltip click={click} down={down} warning={warning} onClose={onClose}>
        {renderTooltip()}
      </Tooltip>
    );
  };

  return (
    <div className="mock-tooltip-container">
      <div {...cbProps}>{children}</div>
      {tooltip()}
    </div>
  );
};

TooltipContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  click:         PropTypes.bool,
  direction:     PropTypes.oneOf(['up', 'down']),
  renderTooltip: PropTypes.func.isRequired,
  warning:       PropTypes.bool,
};

export {TooltipContainer};
