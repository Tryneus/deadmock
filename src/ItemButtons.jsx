import {observer} from 'mobx-react-lite';
import {useAction} from './common';

// add stat
// add effect
// add effect cooldown
// add effect section
// add grid cell
// add grid values
// add grid values value
//
const ItemButtons = observer(({model}) => {
  const onAddStatLine = useAction(() => model.addStat(), [model]);
  const onAddEffect = useAction(() => model.addEffect(), [model]);

  return (
    <div>
      <button onClick={onAddStatLine}>add stat line</button>
      <button onClick={onAddEffect}>add effect</button>
    </div>
  );
});

export {ItemButtons};
export default ItemButtons;
