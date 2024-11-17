import {Icon} from './icon';
import {SemiBold} from './text';

import './spiritScaling.css';

const renderValue = (detailed, value) => {
  if (!detailed) {
    return null;
  }

  return (
    <div className="mock-spirit-scaling-box">
      <SemiBold italic color="#cdcdcd" size={12}>x {value}</SemiBold>
    </div>
  );
};

const SpiritScaling = ({detailed, value}) => {

  return (
    <div className="mock-spirit-scaling">
      <Icon icon="spirit_scaling" />
      {renderValue(detailed, value)}
    </div>
  );
};

export {SpiritScaling};
export default SpiritScaling;
