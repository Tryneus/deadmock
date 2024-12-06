import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';
import PropTypes from 'prop-types';

import {useAction} from '../Common';
import {ItemPicker, TooltipContainer} from '../Editable';
import {Icon} from '../Icon';
import {Bold} from '../Text';

const ItemComponent = observer(({model, index}) => {
  const onDelete = useAction(() => model.removeComponent(index), [index, model]);
  const onChange = useAction((x) => (model.components[index] = x.name), [index, model]);

  const item = model.componentInfo[index];
  const classes = classNames('mock-item-component-badge-icon', `mock-item-component-badge-${item.category}`);

  const renderItemPicker = useCallback(() => <ItemPicker onChange={onChange} />, [onChange]);
  const iconColor = `item-${item.category}`;

  return (
    <div className="mock-item-component">
      <div className="mock-item-component-badge">
        <TooltipContainer click direction="down" renderTooltip={renderItemPicker}>
          <div className={classes}>
            <Icon color={iconColor} image={item.icon} />
          </div>
        </TooltipContainer>
        <div className="mock-item-component-badge-name"><Bold>{item.name}</Bold></div>
      </div>
      <div className="mock-item-component-hover-buttons">
        <Icon color="red" image="cancel" onClick={onDelete} />
      </div>
    </div>
  );
});

const ItemComponents = observer(({model}) => {
  if (model.components.length === 0) {
    return null;
  }

  return (
    <div className="mock-components">
      <div><Bold>COMPONENTS:</Bold></div>
      {model.components.map((_, i) => <ItemComponent key={i} index={i} model={model} />)}
    </div>
  );
});

ItemComponents.propTypes = {
  model: PropTypes.object.isRequired,
};

export {ItemComponents};
