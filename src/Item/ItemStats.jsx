import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';

import {useAction} from '../Common';
import {EditableText} from '../Editable';
import {Icon} from '../Icon';
import {EditableValue} from '../Value';

const ItemStatLine = observer(({model, index}) => {
  const onChangeStat = useAction((x) => (model.stats[index].stat = x), [index, model]);
  const onDelete = useAction(() => model.removeStat(index), [index, model]);

  return (
    <div>
      <EditableValue model={model.stats[index]} />
      <EditableText onChange={onChangeStat}>{model.stats[index].stat}</EditableText>
      <div className="mock-item-stat-hover-buttons">
        <Icon color="red" image="cancel" onClick={onDelete} />
      </div>
    </div>
  );
});

ItemStatLine.propTypes = {
  model: PropTypes.object.isRequired,
};

const ItemStats = observer(({model}) => (
  <div className="mock-item-stats">
    {model.stats.map((x, i) => <ItemStatLine key={i} index={i} model={model} />)}
  </div>
));

ItemStats.propTypes = {
  model: PropTypes.object.isRequired,
};

export {ItemStats};
