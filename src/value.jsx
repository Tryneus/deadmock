import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';
import {EditableText} from './EditableText';
import {useAction} from './common';
import {Bold, SemiBold} from './text';

const parseRegex = /^(([+-]?)\d*(?:.\d+)?)(.*)$/;

const Value = observer(({model}) => {
  const onChange = useAction((x) => {
    const matches = x.match(parseRegex);
    const newValue = matches && parseFloat(matches[1]);
    if (!matches || isNaN(newValue)) {
      console.error('value parse failed', matches, x);
    } else {
      model.signed = matches[2].length > 0;
      model.value = parseFloat(matches[1]);
      model.units = matches[3];
    }
  });

  const renderSign = (signed, value) => {
    if (!signed && value >= 0) {
      return null;
    }
    const sign = value >= 0 ? '+' : '-';
    const color = value >= 0 ? 'normal' : 'bright';
    return <SemiBold color={color}>{sign}</SemiBold>;
  };

  const renderUnits = (units) => {
    if (!model.units) {
      return null;
    }
    return <Bold>{units}</Bold>;
  };


  return (
    <EditableText size={model.size} onChange={onChange}>
      {renderSign(model.signed, model.value)}
      <Bold color="bright" size={model.size}>{Math.abs(model.value)}</Bold>
      {renderUnits(model.units)}
    </EditableText>
  );
});

Value.propTypes = {
  model: PropTypes.object.isRequired,
};

export {Value};
export default Value;
