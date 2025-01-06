import classNames from 'classnames';
import {useCallback} from 'preact/hooks';

const ModeButton = ({label, active, onChange}) => {
  const classes = classNames(
    'mock-image-modal-mode',
    {'mock-image-modal-mode-active': active},
  );
  const onClick = useCallback(() => onChange(label), [label, onChange]);
  return <div className={classes} onClick={onClick}>{label}</div>;
};

const ImageModalHeader = ({modes, active, onChange}) => {
  return (
    <div className="mock-image-modal-header">
      <div className="mock-image-modal-modes">
        {modes.map((mode) => (
          <ModeButton
            key={mode}
            active={active === mode}
            label={mode}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
};

export {ImageModalHeader};
