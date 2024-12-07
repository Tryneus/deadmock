import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';

import {useAction} from '../Common';
import {EditableText} from '../Editable';
import {Bold, SemiBold} from '../Text';

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
  }, [model]);

  const renderSign = (signed, value) => {
    if (!signed && value >= 0) {
      return null;
    }
    const sign = value >= 0 ? '+' : '-';
    return <SemiBold color="muted">{sign}</SemiBold>;
  };

  const renderUnits = (units) => {
    if (!model.units) {
      return null;
    }
    return <Bold color="muted">{units}</Bold>;
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
