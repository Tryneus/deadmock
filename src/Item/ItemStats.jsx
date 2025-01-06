import {observer} from 'mobx-react-lite';

import {useAction} from '/src/Common';
import {Deleteable} from '/src/Deleteable';
import {DragList, DragListGrip} from '/src/DragList';
import {EditableText} from '/src/Text';
import {EditableValue} from '/src/Value';

const ItemStatLine = observer(({itemModel, statModel}) => {
  const onChangeStat = useAction((x) => (statModel.stat = x), [statModel]);
  const onDelete = useAction(() => itemModel.removeStat(statModel), [itemModel, statModel]);

  return (
    <div className="mock-item-stat">
      <Deleteable onMouseDown={onDelete}>
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
