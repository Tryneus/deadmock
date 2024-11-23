import {useCallback} from 'preact/hooks';
import {action, toJS} from 'mobx';
import {observer} from 'mobx-react-lite';
import classNames from 'classnames';
import {Icon} from './icon';
import {Markdown} from './markdown';
import {Text, Medium, SemiBold, Bold} from './text';
import {Value} from './value';
import {Grid} from './grid';
import {EditableMarkdown, EditableText, EditableIcon} from './EditableText';

import './ability.css';

const upgradeMarkdownFormat = {
  text: {
    Component: Text,
    props: {variant: 'semibold', size: 17},
  },
  strong: {
    Component: Text,
    props: {variant: 'bold', bright: true, size: 22},
  },
  emphasis: {
    Component: Text,
    props: {variant: 'medium', italic: true, muted: true},
  },
};

const descriptionMarkdownFormat = {
  text: {
    Component: Text,
    props: {bright: true},
  },
  strong: {
    Component: Text,
    props: {variant: 'bold', bright: true},
  },
  emphasis: {
    Component: Text,
    props: {variant: 'medium', italic: true, muted: true},
  },
};

const HeaderStat = ({model}) => {
  if (!model) {
    return null;
  }

  console.log('header stat', toJS(model));

  return (
    <div className="mock-ability-header-stat">
      <EditableIcon model={model.icon} />
      &nbsp;
      <Value model={model} />
    </div>
  );
};

const partitionHeaderStats = (stats) => {
  return stats.reduce((acc, x) => {
    if (['charges', 'chargeCooldown', 'cooldown'].includes(x.stat)) {
      acc[x.stat] = x;
    } else {
      acc.remainder.push(x);
    }
    return acc;
  }, {remainder: []})
};

// This doesn't appear to be totally consistent across abilities, so we'll go with:
// 'charges' and 'cooldown' on the right, everything else on the left
const Header = observer(({model}) => {
  const onNameChange = useCallback(action((x) => model.name = x));
  const {charges, chargeCooldown, cooldown, remainder} = partitionHeaderStats(model.headerStats);

  return (
    <div className="mock-ability-header">
      <div className="mock-ability-header-left">
        <div className="mock-ability-header-title">
          <EditableText onChange={onNameChange}>{model.name}</EditableText>
        </div>
        <div className="mock-ability-header-misc-stats">
          {remainder.map((x) => <HeaderStat model={x} />)}
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

const tierCosts = [1, 2, 5];

const Upgrade = observer(({model, tier, active}) => {
  const classes = classNames('mock-ability-upgrade', {
    'mock-ability-upgrade-inactive': !active,
  });

  const onChange = useCallback(action((x) => model.description = x));

  return (
    <div className={classes}>
      <div className="mock-ability-upgrade-cost">
        <Icon size={14} image="ability_point" color="purple" />
        &nbsp;
        <Bold>{tierCosts[tier]}</Bold>
      </div>
      <div className="mock-ability-upgrade-text">
        <EditableMarkdown onChange={onChange} text={model.description} format={upgradeMarkdownFormat} />
      </div>
    </div>
  );
});


const Ability = observer(({model}) => {
  const {name, cooldown, duration, charges, chargeCooldown, range, aoe, description, grid, upgrades} = model;
  const onChange = useCallback(action((x) => model.description = x));
  return (
    <div className="mock-ability">
      <Header model={model} />
      <div className="mock-ability-body">
        <div className="mock-ability-description">
          <EditableMarkdown onChange={onChange} text={model.description} format={descriptionMarkdownFormat} />
          <Grid data={model.grid} />
        </div>
        <div className="mock-ability-upgrades">
          {upgrades.map((x, i) => (<Upgrade model={x} tier={i} />))}
        </div>
      </div>
    </div>
  );
});

export {Ability};
export default Ability;
