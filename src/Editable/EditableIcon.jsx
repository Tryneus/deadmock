import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';
import PropTypes from 'prop-types';

import {groupedStatIcons, useAction} from '../Common';
import {Icon, iconColors} from '../Icon';
import {TooltipContainer} from './TooltipContainer';

import './EditableIcon.css';

const IconPickerButton = observer(({image, model}) => {
  const onClick = useAction(() => (model.image = image), [image, model]);
  return (
    <div className="mock-icon-picker-button" onClick={onClick}>
      <Icon color={model.color} image={image} size={20} />
    </div>
  );
});

IconPickerButton.propTypes = {
  model: PropTypes.object.isRequired,
  image: PropTypes.string,
};

const IconPickerColor = observer(({color, model}) => {
  const onClick = useAction(() => (model.color = color), [color, model]);
  return (
    <div className="mock-icon-picker-button" onClick={onClick}>
      <Icon color={color} size={20} />
    </div>
  );
});

IconPickerColor.propTypes = {
  color: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired,
};

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

IconPicker.propTypes = {
  model: PropTypes.object,
};

const EditableIcon = observer(({model}) => {
  const renderTooltip = useCallback(() => <IconPicker model={model} />, [model]);

  return (
    <TooltipContainer click direction="down" renderTooltip={renderTooltip}>
      <Icon color={model.color} image={model.image} size={model.size} />
    </TooltipContainer>
  );
});

EditableIcon.propTypes = {
  model: PropTypes.object.isRequired,
};

export {EditableIcon};
