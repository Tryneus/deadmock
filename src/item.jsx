import classNames from 'classnames';
import {Icon} from './icon';
import {Markdown} from './markdown';
import {Text, Medium, SemiBold, Bold} from './text';
import {Value} from './value';
import {Grid} from './grid';

import './item.css';

const Item = ({data}) => {
  const {name, cost, tier, category, components, stats, active, passive} = data;
  const classes = classNames("mock-item", category);
  return (
    <div className={classes}>
      <Header {...{name, cost, tier, category}} />
      <Components data={components} />
      <Stats data={stats} />
      <Active {...active} />
      <Passive {...passive} />
    </div>
  );
};

const categoryBonuses = {
  spirit: {
    tier: [0, 4, 8, 12, 16],
    stat: "Spirit Power",
    icon: "spirit",
  },
  weapon: {
    units: "%",
    tier: [0, 6, 10, 14, 18],
    stat: "Weapon Damage",
    icon: "weapon",
  },
  vitality: {
    units: "%",
    tier: [0, 11, 14, 17, 20],
    stat: "Base Health",
    icon: "vitality",
  },
};

const soulsFormatOptions = {};
const soulsFormatter = new Intl.NumberFormat('en-US', soulsFormatOptions);

const Header = ({name, cost, tier, category}) => {
  const bonus = categoryBonuses[category];
  if (!bonus) {
    throw new Error(`invalid category: ${category}`)
  }

  return (
    <div className="mock-header">
      <div>
        <div className="item-name">{name}</div>
        <div className="item-cost"><Icon icon="soul" />{soulsFormatter.format(cost)}</div>
      </div>
      <div>
        <div className="item-bonus-value">
          <Value value={bonus.tier[tier]} units={bonus.units} signed />
          <Icon small icon={bonus.icon} />
        </div>
        <div className="item-bonus-stat">{bonus.stat}</div>
      </div>
    </div>
  );
};

const Components = ({data}) => {
  const lines = data.map((x) => {
    const classes = classNames('mock-components-badge', {
      'mock-components-badge-green': x.color === 'green',
      'mock-components-badge-purple': x.color === 'purple',
      'mock-components-badge-orange': x.color === 'orange',
    });
    return (
      <div className={classes} key={x.name}>
        <Icon icon={x.icon} />
        <div className="mock-components-badge-name"><Bold>{x.name}</Bold></div>
      </div>
    );
  });
  return (
    <div className="mock-components">
      <div><Bold>COMPONENTS:</Bold></div>
      {lines}
    </div>
  );
};

const Stats = ({data}) => {
  const lines = data.map((x) => (
    <div key={x.stat}>
      <Value value={x.value} units={x.units} signed/><Medium> {x.stat}</Medium>
    </div>
  ));
  return (
    <div className="mock-stats">
      {lines}  
    </div>
  );
};

const Cooldown = ({seconds}) => (
  <div>
    <Icon small icon="cooldown" />
    <Bold bright>{seconds}s</Bold>
  </div>
);

const ItemAbility = ({cooldown, sections, children}) => {
  const renderedSections = sections.map(({description, grid}) => (
    <div className="mock-item-ability-description">
      <div><Markdown text={description} /></div>
      <Grid data={grid} />
    </div>
  ));
  return (
    <div className="mock-item-ability">
      <div className="mock-item-ability-header">
        {children}
        {cooldown && <Cooldown seconds={cooldown} />}
      </div>
      {renderedSections}
    </div>
  );
};

const Active = (props) => (
  <ItemAbility {...props}>
    <Bold bright>Active</Bold>
  </ItemAbility>
);

const Passive = (props) => (
  <ItemAbility {...props}>
    <SemiBold italic>Passive</SemiBold>
  </ItemAbility>
);

export {Item};
export default Item;
