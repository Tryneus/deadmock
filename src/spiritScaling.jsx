import PropTypes from 'prop-types';
import {EditableText} from './EditableText';
import {Icon} from './icon';

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

const SpiritScaling = ({value, detailed, onChange}) => {
  return (
    <div className="mock-spirit-scaling">
      <Icon image="spirit_scaling" />
      {renderValue(detailed, value, onChange)}
    </div>
  );
};

SpiritScaling.propTypes = {
  value:    PropTypes.number.isRequired,
  detailed: PropTypes.bool,
  onChange: PropTypes.func,
};

export {SpiritScaling};
export default SpiritScaling;
