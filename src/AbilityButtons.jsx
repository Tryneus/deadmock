import {observer} from 'mobx-react-lite';
import {useAction} from './common';
import {toJS} from 'mobx';

const GridButtons = observer(({model}) => {
  const onAddCell = useAction(() => model.addCell(), [model]);
  const onAddValue = useAction(() => model.addValue(), [model]);

  return (
    <div>
      <button onClick={onAddCell}>add cell</button>
      <button onClick={onAddValue}>add value</button>
    </div>
  );
});

const AbilityButtons = observer(({model}) => {
  const onAddHeaderStat = useAction(() => model.addStat(), [model]);
  const onAddCharges = useAction(() => model.addEffect(), [model]);
  const onAddCooldown = useAction(() => model.addStat(), [model]);

  const charges = model.headerStats.some((x) => x.stat === 'charges');
  const cooldown = model.headerStats.some((x) => x.stat === 'cooldown');

  return (
    <div>
      <button onClick={onAddHeaderStat}>add stat</button>
      {charges ? null : <button onClick={onAddCharges}>add charges</button>}
      {cooldown ? null : <button onClick={onAddCooldown}>add cooldown</button>}
      <GridButtons model={model.grid} />
    </div>
  );
});

export {AbilityButtons};
export default AbilityButtons;
