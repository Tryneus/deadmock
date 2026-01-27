import {observer} from 'mobx-react-lite';

import {useAction} from '/src/Common';
import {EditableText} from '/src/Text';
import './Scaling.css';

const renderSpiritValue = (detailed, model, onChange) => {
  if (!detailed) {
    return null;
  }

  return (
    <div className="mock-spirit-scaling-box">
      <div>
        <span>x</span>
        <EditableText onChange={onChange}>{model.spiritScaling}</EditableText>
      </div>
    </div>
  );
};

const renderMeleeValue = (detailed, model, onChange) => {
  if (!detailed) {
    return null;
  }

  return (
    <div className="mock-melee-scaling-box">
      <div>
        <span>x</span>
        <EditableText onChange={onChange}>{model.meleeScaling}</EditableText>
      </div>
    </div>
  );
};

const renderBoonValue = (detailed, model, onChange) => {
  if (!detailed) {
    return null;
  }

  return (
    <div className="mock-boon-scaling-box">
      <div>
        <span>x</span>
        <EditableText onChange={onChange}>{model.boonScaling}</EditableText>
      </div>
    </div>
  );
};

const getScalingField = (model) => {
  if (model.spiritScaling !== null && model.spiritScaling !== undefined) {
    return 'spiritScaling';
  } else if (model.meleeScaling !== null && model.meleeScaling !== undefined) {
    return 'meleeScaling';
  } else if (model.boonScaling !== null && model.boonScaling !== undefined) {
    return 'boonScaling';
  }
  return null;
};

const Scaling = observer(({model, detailed}) => {
  const onChange = useAction((x) => {
    const newValue = parseFloat(x);
    if (isNaN(newValue)) {
      console.error('failed to parse', x);
    } else {
      model[getScalingField(model)] = newValue;
    }
  }, [model]);

  const scalingField = getScalingField(model);
  if (scalingField === 'spiritScaling') {
    return (
      <div className="mock-spirit-scaling">
        <span className="mock-spirit-scaling-icon" />
        {renderSpiritValue(detailed, model, onChange)}
      </div>
    );
  } else if (scalingField === 'meleeScaling') {
    return (
      <div className="mock-melee-scaling">
        <span className="mock-melee-scaling-icon" />
        {renderMeleeValue(detailed, model, onChange)}
      </div>
    );
  } else if (scalingField === 'boonScaling') {
    return (
      <div className="mock-boon-scaling">
        <span className="mock-boon-scaling-icon" />
        {renderBoonValue(detailed, model, onChange)}
      </div>
    );
  }
  return null;
});

export {Scaling};
