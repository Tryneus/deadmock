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
};

const TooltipContainer = ({renderTooltip, direction, click, children}) => {
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
      <Tooltip click={click} down={down} onClose={onClose}>
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
};

export {TooltipContainer};
