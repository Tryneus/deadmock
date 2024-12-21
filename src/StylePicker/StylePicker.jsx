import classNames from 'classnames';
import {observer} from 'mobx-react-lite';

import {useAction} from '/src/Common';
import {textColors} from '/src/Text';

import './StylePicker.css';

const StylePickerColor = observer(({model, color}) => {
  const onClick = useAction(() => (model.color = color), [color, model]);
  const classes = classNames('mock-style-picker-color', `mock-text-color-${color}`);
  return (
    <div className={classes} onClick={onClick} />
  );
});

const weights = [400, 500, 600, 700];

const StylePickerWeight = observer(({model, weight}) => {
  const colorClass = `mock-text-color-${model.color}`;
  const classes = classNames('mock-style-picker-weight', {
    [colorClass]: Boolean(model.color),
  });
  const onClick = useAction(() => (model.weight = weight), [weight, model]);
  return (
    <div className={classes} style={{fontWeight: weight}} onClick={onClick}>Aa</div>
  );
});

const StylePicker = observer(({model}) => {
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

export {StylePicker};
