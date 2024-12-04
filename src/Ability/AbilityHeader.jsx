import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';

import {useAction} from '../Common';
import {EditableText} from '../Editable';
import {SidebarButton, SidebarButtons} from '../SidebarButtons';
import {AbilityStat} from './AbilityStat';

// This doesn't appear to be totally consistent across abilities, so we'll go with:
// 'charges' and 'cooldown' on the right, everything else on the left
const partitionStats = (stats) => stats.reduce((acc, x) => {
  if (['charges', 'chargeCooldown', 'cooldown'].includes(x.stat)) {
    acc[x.stat] = x;
  } else {
    acc.remainder.push(x);
  }
  return acc;
}, {remainder: []});

const AbilityHeader = observer(({model}) => {
  const onNameChange = useAction((x) => (model.name = x), [model]);
  const onAddStat = useAction(() => model.addStat(), [model]);
  const onAddCooldown = useAction(() => {
    model.addStat({icon: {image: 'stat/cooldown'}, value: 1, units: 's', signed: false, stat: 'cooldown'});
  }, [model]);
  const onAddCharges = useAction(() => {
    model.addStat({icon: {image: 'stat/charge'}, value: 1, units: '', signed: false, stat: 'charges'});
    model.addStat({icon: {image: 'stat/charge_cooldown'}, value: 1, units: 's', signed: false, stat: 'chargeCooldown'});
  }, [model]);
  const onAddMarkdown = useAction(() => model.addMarkdownSection());
  const onAddGrid = useAction(() => model.addGridSection());

  const {charges, chargeCooldown, cooldown, remainder} = partitionStats(model.stats);

  const renderHeaderButtons = () => {
    return (
      <>
        <SidebarButton label="Stat" onClick={onAddStat} />
        {cooldown ? null : <SidebarButton label="Cooldown" onClick={onAddCooldown} />}
        {charges && chargeCooldown ? null : <SidebarButton label="Charges" onClick={onAddCharges} />}
        <SidebarButton label="Markdown" onClick={onAddMarkdown} />
        <SidebarButton label="Grid" onClick={onAddGrid} />
      </>
    );
  };

  const renderCharges = () => {
    if (!charges && !chargeCooldown) {
      return null;
    }

    return (
      <div className="mock-ability-stat-group">
        <AbilityStat model={model} value={charges} />
        <AbilityStat model={model} value={chargeCooldown} />
      </div>
    );
  };

  return (
    <SidebarButtons renderButtons={renderHeaderButtons}>
      <div className="mock-ability-header">
        <div className="mock-ability-header-left">
          <div className="mock-ability-header-title">
            <EditableText onChange={onNameChange}>{model.name}</EditableText>
          </div>
          <div className="mock-ability-header-misc-stats">
            {remainder.map((x, i) => <AbilityStat key={i} model={model} value={x} />)}
          </div>
        </div>
        <div className="mock-ability-header-right">
          {renderCharges()}
          <AbilityStat model={model} value={cooldown} />
        </div>
      </div>
    </SidebarButtons>
  );
});

AbilityHeader.propTypes = {
  model: PropTypes.object.isRequired,
};

export {AbilityHeader};
