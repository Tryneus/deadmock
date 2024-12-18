import {observer} from 'mobx-react-lite';

import {useAction} from '../Common';
import {Deleteable} from '../Deleteable';
import {EditableIcon} from '../Icon';
import {EditableValue} from '../Value';

const AbilityStat = observer(({model, value}) => {
  const onDelete = useAction(() => model.removeStat(value), [model, value]);

  if (!value) {
    return null;
  }

  return (
    <Deleteable overlap onClick={onDelete}>
      <div className="mock-ability-stat">
        <EditableIcon model={value.icon} />
        <EditableValue model={value} />
      </div>
    </Deleteable>
  );
});

export {AbilityStat};
