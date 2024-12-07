import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';

import {useAction} from '../Common';
import {textColors} from '../Text';

import './StylePicker.css';

const StylePickerColor = observer(({model, color}) => {
  const onClick = useAction(() => (model.color = color), [color, model]);
  const classes = classNames('mock-style-picker-color', `mock-text-color-${color}`);
  return (
    <div className={classes} onClick={onClick} />
  );
});

StylePickerColor.propTypes = {
  model: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
};

const weights = [400, 500, 600, 700];

const StylePickerWeight = observer(({model, weight}) => {
  const colorClass = `mock-text-color-${model.color}`;
  const classes = classNames('mock-style-picker-weight', {
    [colorClass]: Boolean(model.color),
  });
  const onClick = useAction(() => (model.weight = weight), [weight, model]);
  const style = {fontWeight: weight};
  return (
    <div className={classes} style={style} onClick={onClick}>Aa</div>
  );
});

StylePickerWeight.propTypes = {
  model:  PropTypes.object.isRequired,
  weight: PropTypes.oneOf([400, 500, 600, 700]).isRequired,
};

const StylePicker = observer(({model}) => {
  console.log(JSON.stringify(model));
  return (
    <div className="mock-style-picker">
      <div>
        {textColors.map((c) => <StylePickerColor key={c} color={c} model={model} />)}
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
