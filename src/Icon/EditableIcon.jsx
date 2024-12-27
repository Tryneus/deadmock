import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';

import {groupedStatIcons, useAction} from '/src/Common';
import {TooltipContainer} from '/src/Tooltip';

import {Icon, iconColors} from './Icon';
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

const IconPicker = observer(({model, resize}) => {
  const toggleSize = useAction(() => (model.large = !model.large), [model]);
  const resizeImage = model.large ? 'compress' : 'expand';

  const renderResize = () => (
    <span onClick={toggleSize}>
      <Icon color="white" image={resizeImage} />
    </span>
  );

  return (
    <div className="mock-icon-picker">
      <div>
        {resize && renderResize()}
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

const EditableIcon = observer(({model, resize}) => {
  const renderTooltip = useCallback(() => <IconPicker model={model} resize={resize} />, [model, resize]);

  return (
    <TooltipContainer click direction="down" renderTooltip={renderTooltip}>
      <Icon color={model.color} image={model.image} large={model.large} />
    </TooltipContainer>
  );
});

export {EditableIcon};
