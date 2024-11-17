import classNames from 'classnames';
import {Icon} from './icon';
import {Markdown} from './markdown';
import {Text, Medium, SemiBold, Bold} from './text';
import {Value} from './value';
import {Grid} from './grid';

import './item.css';

const example = {
  category: "spirit",
  name: "Slowing Hex",
  cost: 1750,
  tier: 2,
  components: [
    {icon: "item/enduring_spirit", name: "Enduring Spirit"},
  ],
  stats: [
    {units: "%", value: 10, stat: "Spirit Lifesteal"},
    {value: 5, stat: "Spirit Power"},
    {value: 75, stat: "Bonus Health"},
  ],
  active: {
    cooldown: 26,
    description: "Deals **Spirit Damage**, **Slows** targets movement and dashes.  Also **Silences their movement-based items and abilities.**\n_Does not affect target's stamina usage._",
    grid: [
      [
        {type: "spirit_damage", value: 80},
        {type: "conditional", value: 20, units: "%", stat: "Movement Slow", noPos: true, icon: "movement_slow"},
        {type: "conditional", value: -30, units: "%", stat: "Dash Distance", noPos: true, icon: "movement_slow"}],
      [{type: "values", values: [
        {value: 29, units: 'm', stat: 'Cast Range'},
        {value: 3, units: 's', stat: 'Duration'},
      ]}],
    ],
  },
  passive: null,
};

const Item = () => {
  const item = example;
  const {name, cost, tier, category, components, stats, active, passive} = item;
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
          <Value value={bonus.tier[tier]} units={bonus.units} />
          <Icon small icon={bonus.icon} />
        </div>
        <div className="item-bonus-stat">{bonus.stat}</div>
      </div>
    </div>
  );
};

const Components = ({data}) => {
  const lines = data.map((x) => (
    <div className="mock-components-badge" key={x.name}>
      <Icon icon={x.icon} />
      <div className="mock-components-badge-name"><Bold>{x.name}</Bold></div>
    </div>
  ));
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
      <Value value={x.value} units={x.units}/><Medium> {x.stat}</Medium>
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

const Active = ({cooldown, description, grid}) => {
  return (
    <div className="mock-active">
      <div className="mock-active-header">
        <div><Bold bright>Active</Bold></div>
        <Cooldown seconds={cooldown} />
      </div>
      <div className="mock-active-description">
        <div><Markdown text={description} /></div>
        <Grid data={grid} />
      </div>
    </div>
  );
};

const Passive = () => {
};

export {Item};
export default Item;
