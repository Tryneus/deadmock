import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';

import {useAction} from '/src/Common';
import {Deleteable} from '/src/Deleteable';
import {Icon} from '/src/Icon';
import {ItemPicker} from '/src/ItemPicker';
import {Bold} from '/src/Text';
import {TooltipContainer} from '/src/Tooltip';

const ItemComponent = observer(({model, index}) => {
  const onDelete = useAction(() => model.removeComponent(index), [index, model]);
  const onChange = useAction((x) => (model.components[index] = x.name), [index, model]);

  const item = model.componentInfo[index];
  const classes = classNames('mock-item-component-badge-icon', `mock-item-component-badge-${item.category}`);

  const renderItemPicker = useCallback(() => <ItemPicker onChange={onChange} />, [onChange]);
  const iconColor = `item-${item.category}`;

  return (
    <div className="mock-item-component">
      <Deleteable onClick={onDelete}>
        <div className="mock-item-component-badge">
          <TooltipContainer click direction="down" renderTooltip={renderItemPicker}>
            <div className={classes}>
              <Icon color={iconColor} image={item.icon} />
            </div>
          </TooltipContainer>
          <div className="mock-item-component-badge-name"><Bold>{item.name}</Bold></div>
        </div>
      </Deleteable>
    </div>
  );
});

const ItemComponents = observer(({model}) => {
  if (model.components.length === 0) {
    return null;
  }

  return (
    <div className="mock-item-components">
      <div><Bold>COMPONENTS:</Bold></div>
      {model.components.map((_, i) => <ItemComponent key={i} index={i} model={model} />)}
    </div>
  );
});

export {ItemComponents};
