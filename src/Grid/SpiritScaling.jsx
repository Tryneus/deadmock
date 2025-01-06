import {observer} from 'mobx-react-lite';

import {useAction} from '/src/Common';
import {EditableText} from '/src/Text';
import './SpiritScaling.css';

const renderValue = (detailed, model, onChange) => {
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

const SpiritScaling = observer(({model, detailed}) => {
  const onChange = useAction((x) => {
    const newValue = parseFloat(x);
    if (isNaN(newValue)) {
      console.error('failed to parse', x);
    } else {
      model.spiritScaling = newValue;
    }
  }, [model]);

  if (model.spiritScaling === null || model.spiritScaling === undefined) {
    return null;
  }

  return (
    <div className="mock-spirit-scaling">
      <span className="mock-spirit-scaling-icon" />
      {renderValue(detailed, model, onChange)}
    </div>
  );
});

export {SpiritScaling};
