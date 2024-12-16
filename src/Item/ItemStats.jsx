import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';

import {useAction} from '../Common';
import {Deleteable} from '../Deleteable';
import {DragList, DragListGrip} from '../DragList';
import {EditableText} from '../Text';
import {EditableValue} from '../Value';

const ItemStatLine = observer(({model, index}) => {
  const onChangeStat = useAction((x) => (model.stats[index].stat = x), [index, model]);
  const onDelete = useAction(() => model.removeStat(index), [index, model]);

  return (
    <div className="mock-item-stat">
      <Deleteable onClick={onDelete}>
        <DragListGrip />
        <EditableValue model={model.stats[index]} />
        <EditableText onChange={onChangeStat}>{model.stats[index].stat}</EditableText>
      </Deleteable>
    </div>
  );
});

const ItemStats = observer(({model}) => {
  const onMove = useAction((mutation) => mutation(model.stats), [model]);

  if (model.stats.length === 0) {
    return null;
  }

  return (
    <div className="mock-item-stats">
      <DragList onMove={onMove}>
        {model.stats.map((x, i) => <ItemStatLine key={i} index={i} model={model} />)}
      </DragList>
    </div>
  );
});

export {ItemStats};
