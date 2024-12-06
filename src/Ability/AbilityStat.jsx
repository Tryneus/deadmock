import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';

import {useAction} from '../Common';
import {EditableIcon} from '../Editable';
import {Icon} from '../Icon';
import {Value} from '../Value';

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
    <div className="mock-ability-stat">
      <EditableIcon model={value.icon} />
      &nbsp;
      <Value model={value} />
      <div className="mock-ability-stat-hover-button">
        <div>
          <Icon color="red" image="cancel" size={12} onClick={onDelete} />
        </div>
      </div>
    </div>
  );
});

AbilityStat.propTypes = {
  model: PropTypes.object.isRequired,
  value: PropTypes.object,
};

export {AbilityStat};
