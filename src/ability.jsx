import classNames from 'classnames';
import {Icon} from './icon';
import {Markdown} from './markdown';
import {Text, Medium, SemiBold, Bold} from './text';
import {Value} from './value';
import {Grid} from './grid';

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

const HeaderStat = ({icon, value, units}) => {
  if (value === null || value === undefined) {
    return null;
  }

  return (
    <div className="mock-ability-header-stat">
      <Icon size={18} icon={icon} color="grey" />
      &nbsp;
      <Value value={value} units={units} />
    </div>
  );
};

const HeaderStatGroup = ({children}) => (
  <div className="mock-ability-header-stat-group">
    {children}
  </div>
);

// ability header should be 'charges' - 'cooldown' on the right, 'range', 'aoe', 'duration' on the left.
const Header = ({name, range, aoe, duration, charges, chargeCooldown, cooldown}) => (
  <div className="mock-ability-header">
    <div className="mock-ability-header-left">
      <div className="mock-ability-header-title">
        <Bold bright>{name}</Bold>
      </div>
      <div className="mock-ability-header-misc-stats">
        <HeaderStat icon="range" value={range} units="m" />
        <HeaderStat icon="aoe" value={aoe} units="m" />
        <HeaderStat icon="duration" value={duration} units="s" />
      </div>
    </div>
    <div className="mock-ability-header-right">
      <HeaderStatGroup>
        <HeaderStat icon="charge" value={charges} />
        <HeaderStat icon="charge_cooldown" value={chargeCooldown} units="s" />
      </HeaderStatGroup>
      <HeaderStat icon="cooldown" value={cooldown} units="s" />
    </div>
  </div>
);

const Upgrade = ({tier, text, active}) => {
  const classes = classNames('mock-ability-upgrade', {
    'mock-ability-upgrade-inactive': !active,
  });

  return (
    <div className={classes}>
      <div className="mock-ability-upgrade-cost">
        <Icon size={14} icon="ability_point" color="purple" />
        &nbsp;
        <Bold>{tier}</Bold>
      </div>
      <div className="mock-ability-upgrade-text">
        <Markdown text={text} format={upgradeMarkdownFormat} />
      </div>
    </div>
  );
};


const Ability = ({data}) => {
  const {name, cooldown, duration, charges, chargeCooldown, range, aoe, description, grid, upgrades} = data;
  return (
    <div className="mock-ability">
      <Header {...{name, cooldown, duration, charges, chargeCooldown, range, aoe}} />
      <div className="mock-ability-body">
        <div className="mock-ability-description">
          <Markdown text={description} format={descriptionMarkdownFormat} />
          <Grid data={grid} />
        </div>
        <div className="mock-ability-upgrades">
          {upgrades.map((x, i) => (<Upgrade tier={i+1} text={x} />))}
        </div>
      </div>
    </div>
  );
};

export {Ability};
export default Ability;
