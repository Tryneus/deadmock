import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';

import {useAction} from '../Common';
import {EditableText} from '../Editable';
import {Bold, SemiBold} from '../Text';

const parseRegex = /^(([+-]?)\d*(?:.\d+)?)(.*)$/;

const Value = observer((props) => {
  const renderSign = (signed, value) => {
    if (!signed && value >= 0) {
      return null;
    }
    const sign = value >= 0 ? '+' : '-';
    return <SemiBold color="muted">{sign}</SemiBold>;
  };

  const renderUnits = (units) => {
    if (!units) {
      return null;
    }
    return <Bold color="muted">{units}</Bold>;
  };

  return (
    <>
      {renderSign(props.signed, props.value)}
      <Bold color="bright" size={props.size}>{Math.abs(props.value)}</Bold>
      {renderUnits(props.units)}
    </>
  );
});

Value.propTypes = {
  signed: PropTypes.bool,
  size:   PropTypes.number,
  units:  PropTypes.string,
  value:  PropTypes.number,
};

const EditableValue = observer(({model}) => {
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
  }, [model]);

  return (
    <EditableText size={model.size} onChange={onChange}>
      <Value signed={model.signed} size={model.size} units={model.units} value={model.value} />
    </EditableText>
  );
});

EditableValue.propTypes = {
  model: PropTypes.object.isRequired,
};

export {EditableValue, Value};
