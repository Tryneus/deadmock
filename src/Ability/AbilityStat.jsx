import {observer} from 'mobx-react-lite';

import {useAction} from '../Common';
import {Deleteable} from '../Deleteable';
import {EditableIcon} from '../Editable';
import {EditableValue} from '../Value';

const AbilityStat = observer(({model, value}) => {
  const onDelete = useAction(() => {
    const idx = model.stats.indexOf(value);
    if (idx === -1) {
      console.error('could not find stat', value, model.stats);
    } else {
      model.removeStat(idx);
    }
  }, [value, model]);

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
