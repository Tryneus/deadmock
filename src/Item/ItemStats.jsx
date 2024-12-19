import {observer} from 'mobx-react-lite';

import {useAction} from '../Common';
import {Deleteable} from '../Deleteable';
import {DragList, DragListGrip} from '../DragList';
import {EditableText} from '../Text';
import {EditableValue} from '../Value';

const ItemStatLine = observer(({itemModel, statModel}) => {
  const onChangeStat = useAction((x) => (statModel.stat = x), [statModel]);
  const onDelete = useAction(() => itemModel.removeStat(statModel), [itemModel, statModel]);

  return (
    <div className="mock-item-stat">
      <Deleteable onClick={onDelete}>
        <DragListGrip />
        <EditableValue model={statModel} />
        <EditableText onChange={onChangeStat}>{statModel.stat}</EditableText>
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
        {model.stats.map((x) => <ItemStatLine key={x.id} itemModel={model} statModel={x} />)}
      </DragList>
    </div>
  );
});

export {ItemStats};
