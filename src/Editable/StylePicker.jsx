import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';

import {useAction} from '../Common';
import {textColors} from '../Text';

import './StylePicker.css';

const StylePickerColor = observer(({model, color}) => {
  const onClick = useAction(() => (model.color = color), [color, model]);
  const style = {backgroundColor: textColors[color]};
  return (
    <div className="mock-style-picker-color" style={style} onClick={onClick} />
  );
});

StylePickerColor.propTypes = {
  model: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
};

const weights = [400, 500, 600, 700];

const StylePickerWeight = observer(({model, weight}) => {
  const onClick = useAction(() => (model.weight = weight), [weight, model]);
  const style = {fontWeight: weight, color: textColors[model.color]};
  return (
    <div className="mock-style-picker-weight" style={style} onClick={onClick}>Aa</div>
  );
});

StylePickerWeight.propTypes = {
  model:  PropTypes.object.isRequired,
  weight: PropTypes.oneOf([400, 500, 600, 700]).isRequired,
};

const StylePicker = observer(({model}) => {
  return (
    <div className="mock-style-picker">
      <div>
        {Object.keys(textColors).map((c) => <StylePickerColor key={c} color={c} model={model} />)}
      </div>
      <div>
        {weights.map((w) => <StylePickerWeight key={w} model={model} weight={w} />)}
      </div>
    </div>
  );
});

StylePicker.propTypes = {
  model: PropTypes.object.isRequired,
};

export {StylePicker};
