import classNames from 'classnames';
import {observer} from 'mobx-react-lite';

import {useAction} from '/src/Common';
import {Deleteable} from '/src/Deleteable';
import {Details} from '/src/Details';
import {DragListGrip} from '/src/DragList';
import {Icon} from '/src/Icon';
import {Bold, EditableText, SemiBold, Text} from '/src/Text';

const ItemEffect = observer(({item, model}) => {
  const onChangeCooldown = useAction((x) => {
    const newValue = parseFloat(x);
    if (isNaN(newValue)) {
      console.error('failed to parse', x);
    } else {
      model.cooldown = newValue;
    }
  }, [model]);

  const onChangeActive = useAction(() => (model.active = !model.active), [model]);

  const onDelete = useAction(() => item.removeEffect(model), [item, model]);

  const effectType = model.active ?
    <Bold color="bright">Active</Bold> :
    <SemiBold italic>Passive</SemiBold>;

  const headerClasses = classNames('mock-item-effect-header', {
    'mock-item-effect-header-active': model.active,
  });
  const cooldownClasses = classNames('mock-item-effect-cooldown', {
    'mock-item-effect-no-cooldown': !model.cooldown,
  });

  return (
    <div className="mock-item-effect">
      <div className={headerClasses}>
        <Deleteable onClick={onDelete}>
          <DragListGrip />
          <span className="mock-item-effect-type" onClick={onChangeActive}>
            {effectType}
          </span>
        </Deleteable>
        <div className={cooldownClasses}>
          <Icon image="stat/cooldown" />
          <EditableText onChange={onChangeCooldown}>
            <Text color="bright">{model.cooldown || 0}</Text>
          </EditableText>
          <Bold>
            s
          </Bold>
        </div>
      </div>
      <Details model={model.details} />
    </div>
  );
});

export {ItemEffect};
