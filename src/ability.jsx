import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';
import {EditableIcon, EditableMarkdown, EditableText} from './EditableText';
import {SidebarButtons, SidebarButton} from './SidebarButtons';
import {useAction} from './common';
import {Grid} from './grid';
import {Icon} from './icon';
import {Bold, Text} from './text';
import {Value} from './value';

import './ability.css';

const upgradeMarkdownFormat = {
  text: {
    Component: Text,
    props:     {weight: 600, size: 17},
  },
  strong: {
    Component: Text,
    props:     {weight: 700, size: 22, color: 'bright'},
  },
  emphasis: {
    Component: Text,
    props:     {weight: 500, italic: true, color: 'muted'},
  },
};

const descriptionMarkdownFormat = {
  text: {
    Component: Text,
    props:     {color: 'bright'},
  },
  strong: {
    Component: Text,
    props:     {weight: 700, color: 'bright'},
  },
  emphasis: {
    Component: Text,
    props:     {weight: 500, italic: true, color: 'muted'},
  },
};


const AbilityStat = ({model, value}) => {
  const onDelete = useAction(() => {
    const idx = model.stats.indexOf(value);
    if (idx === -1) {
      console.log('could not find stat', value, model.stats);
    } else {
      model.removeStat(idx);
    }
  });

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
};

AbilityStat.propTypes = {
  model: PropTypes.object.isRequired,
  value: PropTypes.object,
};

const partitionStats = (stats) => stats.reduce((acc, x) => {
  if (['charges', 'chargeCooldown', 'cooldown'].includes(x.stat)) {
    acc[x.stat] = x;
  } else {
    acc.remainder.push(x);
  }
  return acc;
}, {remainder: []});

// This doesn't appear to be totally consistent across abilities, so we'll go with:
// 'charges' and 'cooldown' on the right, everything else on the left
const Header = observer(({model}) => {
  const onNameChange = useAction((x) => (model.name = x), [model]);
  const onAddStat = useAction(() => model.addStat(), [model]);
  const onAddCooldown = useAction(() => {
    model.addStat({icon: {image: 'stat/cooldown'}, value: 1, units: 's', signed: false, stat: 'cooldown'});
  }, [model]);
  const onAddCharges = useAction(() => {
    model.addStat({icon: {image: 'stat/charge'}, value: 1, units: '', signed: false, stat: 'charges'});
    model.addStat({icon: {image: 'stat/charge_cooldown'}, value: 1, units: 's', signed: false, stat: 'chargeCooldown'});
  }, [model]);
  const {charges, chargeCooldown, cooldown, remainder} = partitionStats(model.stats);

  const renderHeaderButtons = () => {
    return (
      <>
        <SidebarButton label="Stat" onClick={onAddStat} />
        {cooldown ? null : <SidebarButton label="Cooldown" onClick={onAddCooldown} />}
        {charges ? null : <SidebarButton label="Charges" onClick={onAddCharges} />}
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

Header.propTypes = {
  model: PropTypes.object.isRequired,
};

const tierCosts = [1, 2, 5];

const Upgrade = observer(({active, model, tier}) => {
  const classes = classNames('mock-ability-upgrade', {
    'mock-ability-upgrade-inactive': !active,
  });

  const onChange = useAction((x) => (model.description = x), [model]);

  return (
    <div className={classes}>
      <div className="mock-ability-upgrade-cost">
        <Icon color="purple" image="stat/ability_point" size={14} />
        &nbsp;
        <Bold>{tierCosts[tier]}</Bold>
      </div>
      <div className="mock-ability-upgrade-text">
        <EditableMarkdown format={upgradeMarkdownFormat} text={model.description} onChange={onChange} />
      </div>
    </div>
  );
});

Upgrade.propTypes = {
  model: PropTypes.object.isRequired,
};


const Ability = observer(({model}) => {
  const onChange = useAction((x) => (model.description = x), [model]);
  return (
    <div className="mock-ability">
      <Header model={model} />
      <div className="mock-ability-body">
        <div className="mock-ability-markdown">
          <EditableMarkdown format={descriptionMarkdownFormat} text={model.description} onChange={onChange} />
        </div>
        <Grid data={model.grid} />
        <div className="mock-ability-upgrades">
          {model.upgrades.map((x, i) => <Upgrade key={i} model={x} tier={i} />)}
        </div>
      </div>
    </div>
  );
});

Ability.propTypes = {
  model: PropTypes.object.isRequired,
};

export {Ability};
export default Ability;
