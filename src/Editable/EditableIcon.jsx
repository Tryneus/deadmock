import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';
import PropTypes from 'prop-types';

import {TooltipContainer} from './TooltipContainer';
import {groupedStatIcons, useAction} from '../Common';
import {Icon, iconColors} from '../Icon';

import './EditableIcon.css';

const IconSelectorButton = observer(({image, model}) => {
  const onClick = useAction(() => (model.image = image), [image, model]);
  return (
    <div className="mock-icon-selector-button" onClick={onClick}>
      <Icon color={model.color} image={image} size={20} />
    </div>
  );
});

IconSelectorButton.propTypes = {
  model: PropTypes.object.isRequired,
  image: PropTypes.string,
};

const IconSelectorColor = observer(({color, model}) => {
  const onClick = useAction(() => (model.color = color), [color, model]);
  return (
    <div className="mock-icon-selector-button" onClick={onClick}>
      <Icon color={color} size={20} />
    </div>
  );
});

IconSelectorColor.propTypes = {
  color: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired,
};

const IconSelector = observer(({model}) => {
  return (
    <div className="mock-icon-selector">
      <div>
        {iconColors.map((c) => <IconSelectorColor key={c} color={c} model={model} />)}
      </div>
      {
        groupedStatIcons.map((group, i) => (
          <div key={i}>
            {group.map((path) => <IconSelectorButton key={path} image={path} model={model} />)}
          </div>
        ))
      }
    </div>
  );
});

IconSelector.propTypes = {
  model: PropTypes.object,
};

const EditableIcon = observer(({model}) => {
  const renderTooltip = useCallback(() => <IconSelector model={model} />, [model]);

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
