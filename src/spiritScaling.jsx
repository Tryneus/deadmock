import {useCallback} from 'preact/hooks';
import {action} from 'mobx';
import {Icon} from './icon';
import {EditableText} from './EditableText';

import './spiritScaling.css';

const renderValue = (detailed, value, onChange) => {
  if (!detailed) {
    return null;
  }

  return (
    <div className="mock-spirit-scaling-box">
      <div>
        <span>x&nbsp;</span>
        <EditableText onChange={onChange}>{value}</EditableText>
      </div>
    </div>
  );
};

const SpiritScaling = ({detailed, value, onChange}) => {
  return (
    <div className="mock-spirit-scaling">
      <Icon image="spirit_scaling" />
      {renderValue(detailed, value, onChange)}
    </div>
  );
};

export {SpiritScaling};
export default SpiritScaling;
