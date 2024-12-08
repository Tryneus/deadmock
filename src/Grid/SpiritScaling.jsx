import PropTypes from 'prop-types';

import {EditableText} from '../Editable';
import {Icon} from '../Icon';

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
