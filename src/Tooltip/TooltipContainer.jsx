import classNames from 'classnames';
import {useCallback, useRef, useState} from 'preact/hooks';

import {useClickOutside} from '/src/Common';
import './TooltipContainer.css';

const Tooltip = ({down, children, warning, onClose}) => {
  const ref = useRef(null);
  useClickOutside(ref, onClose);

  const classes = classNames('mock-tooltip', {
    'mock-tooltip-up':      !down,
    'mock-tooltip-down':    down,
    'mock-tooltip-warning': warning,
  });

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
};

const TooltipContainer = ({renderTooltip, direction, children, warning}) => {
  const [open, setOpen] = useState(false);
  const down = direction === 'down';

  const onToggle = useCallback(() => setOpen((x) => !x), [setOpen]);
  const onClose = useCallback(() => setOpen(false), [setOpen]);

  const tooltip = () => (
    <Tooltip down={down} warning={warning} onClose={onClose}>
      {renderTooltip()}
    </Tooltip>
  );

  return (
    <div className="mock-tooltip-container">
      <div onMouseDown={onToggle}>{children}</div>
      {open && tooltip()}
    </div>
  );
};

export {TooltipContainer};
