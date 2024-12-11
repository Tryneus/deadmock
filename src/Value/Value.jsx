import {observer} from 'mobx-react-lite';

import {useAction} from '../Common';
import {Bold, EditableText, SemiBold} from '../Text';

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
      <Bold color="bright">{Math.abs(props.value)}</Bold>
      {renderUnits(props.units)}
    </>
  );
});

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
    <EditableText onChange={onChange}>
      <Value signed={model.signed} units={model.units} value={model.value} />
    </EditableText>
  );
});

export {EditableValue, Value};
