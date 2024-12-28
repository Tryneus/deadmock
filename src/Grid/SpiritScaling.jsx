import {Icon} from '/src/Icon';
import {EditableText} from '/src/Text';

import './SpiritScaling.css';

const renderValue = (detailed, value, onChange) => {
  if (!detailed) {
    return null;
  }

  return (
    <div className="mock-spirit-scaling-box">
      <div>
        <span>x</span>
        <EditableText onChange={onChange}>{value}</EditableText>
      </div>
    </div>
  );
};

const SpiritScaling = ({value, detailed, onChange}) => {
  return (
    <div className="mock-spirit-scaling">
      {renderValue(detailed, value, onChange)}
    </div>
  );
};

export {SpiritScaling};
