import classNames from 'classnames';
import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';
import {EditableIcon, EditableMarkdown, EditableText} from './EditableText';
import {useAction} from './common';
import {Grid} from './grid';
import {Icon} from './icon';
import {Bold, Text} from './text';
import {Value} from './value';

import './ability.css';

const upgradeMarkdownFormat = {
  text: {
    Component: Text,
    props:     {variant: 'semibold', size: 17},
  },
  strong: {
    Component: Text,
    props:     {variant: 'bold', bright: true, size: 22},
  },
  emphasis: {
    Component: Text,
    props:     {variant: 'medium', italic: true, muted: true},
  },
};

const descriptionMarkdownFormat = {
  text: {
    Component: Text,
    props:     {bright: true},
  },
  strong: {
    Component: Text,
    props:     {variant: 'bold', bright: true},
  },
  emphasis: {
    Component: Text,
    props:     {variant: 'medium', italic: true, muted: true},
  },
};

const HeaderStat = ({model}) => {
  if (!model) {
    return null;
  }

  return (
    <div className="mock-ability-header-stat">
      <EditableIcon model={model.icon} />
      &nbsp;
      <Value model={model} />
    </div>
  );
};

HeaderStat.propTypes = {
  model: PropTypes.object.isRequired,
};

const partitionHeaderStats = (stats) => stats.reduce((acc, x) => {
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
  const {charges, chargeCooldown, cooldown, remainder} = partitionHeaderStats(model.headerStats);

  return (
    <div className="mock-ability-header">
      <div className="mock-ability-header-left">
        <div className="mock-ability-header-title">
          <EditableText onChange={onNameChange}>{model.name}</EditableText>
        </div>
        <div className="mock-ability-header-misc-stats">
          {remainder.map((x, i) => <HeaderStat key={i} model={x} />)}
        </div>
      </div>
      <div className="mock-ability-header-right">
        <div className="mock-ability-header-stat-group">
          <HeaderStat model={charges} />
          <HeaderStat model={chargeCooldown} />
        </div>
        <HeaderStat model={cooldown} />
      </div>
    </div>
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
        <div className="mock-ability-description">
          <EditableMarkdown format={descriptionMarkdownFormat} text={model.description} onChange={onChange} />
          <Grid data={model.grid} />
        </div>
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
