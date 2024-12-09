import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';

import {groupedStatIcons, useAction} from '../Common';
import {Icon, iconColors} from '../Icon';
import {TooltipContainer} from './TooltipContainer';

import './EditableIcon.css';

const IconPickerButton = observer(({image, model}) => {
  const onClick = useAction(() => (model.image = image), [image, model]);
  return (
    <div className="mock-icon-picker-button" onClick={onClick}>
      <Icon color={model.color} image={image} />
    </div>
  );
});

const IconPickerColor = observer(({color, model}) => {
  const onClick = useAction(() => (model.color = color), [color, model]);
  return (
    <div className="mock-icon-picker-button" onClick={onClick}>
      <Icon color={color} />
    </div>
  );
});

const IconPicker = observer(({model}) => {
  return (
    <div className="mock-icon-picker">
      <div>
        {iconColors.map((c) => <IconPickerColor key={c} color={c} model={model} />)}
      </div>
      {
        groupedStatIcons.map((group, i) => (
          <div key={i}>
            {group.map((path) => <IconPickerButton key={path} image={path} model={model} />)}
          </div>
        ))
      }
    </div>
  );
});

const EditableIcon = observer(({model}) => {
  const renderTooltip = useCallback(() => <IconPicker model={model} />, [model]);

  return (
    <TooltipContainer click direction="down" renderTooltip={renderTooltip}>
      <Icon color={model.color} image={model.image} large={model.large} />
    </TooltipContainer>
  );
});

export {EditableIcon};
