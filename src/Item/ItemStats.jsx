import {observer} from 'mobx-react-lite';

import {useAction} from '../Common';
import {Deleteable} from '../Deleteable';
import {EditableText} from '../Editable';
import {EditableValue} from '../Value';

const ItemStatLine = observer(({model, index}) => {
  const onChangeStat = useAction((x) => (model.stats[index].stat = x), [index, model]);
  const onDelete = useAction(() => model.removeStat(index), [index, model]);

  return (
    <Deleteable onClick={onDelete}>
      <EditableValue model={model.stats[index]} />
      <EditableText onChange={onChangeStat}>{model.stats[index].stat}</EditableText>
    </Deleteable>
  );
});

const ItemStats = observer(({model}) => (
  <div className="mock-item-stats">
    {model.stats.map((x, i) => <ItemStatLine key={i} index={i} model={model} />)}
  </div>
));

export {ItemStats};
