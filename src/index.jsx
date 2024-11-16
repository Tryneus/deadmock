import {render} from 'preact';
import classNames from 'classnames';
import {Icon} from './icon';
import {Markdown} from './markdown';
import {Text, Medium, SemiBold, Bold} from './text';
import fonts from '../asset/font';

import './style.css';

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
  const classes = classNames("mock", "item", category);
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

const Number = ({value, units, noPos}) => {
  const signStr = value > 0 ? '+' : '-';
  const sign = (value >= 0 && noPos) ? null : (<SemiBold bright={value < 0}>{signStr}</SemiBold>);
  return (
    <span>
      {sign}
      <Bold bright>{Math.abs(value)}</Bold>
      {units ? (<Bold>{units}</Bold>) : null}
    </span>
  );
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
          <Number value={bonus.tier[tier]} units={bonus.units} />
          <Icon small icon={bonus.icon} />
        </div>
        <div className="item-bonus-stat">{bonus.stat}</div>
      </div>
    </div>
  );
};

const Components = ({data}) => {
  const lines = data.map((x) => (
    <div className="item-badge" key={x.name}>
      <Icon icon={x.icon} />
      <div className="item-badge-name"><Bold>{x.name}</Bold></div>
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
      <Number value={x.value} units={x.units}/><Medium> {x.stat}</Medium>
    </div>
  ));
  return (
    <div className="mock-stats">
      {lines}  
    </div>
  );
};

const Grid = ({children}) => {
  return (
    <div className="mock-grid">
      {children}
    </div>
  );
};

const Cooldown = ({seconds}) => (
  <div>
    <Icon small icon="cooldown" />
    <Bold bright>{seconds}s</Bold>
  </div>
);

const GridCellValues = ({values}) => (
  <>
    {values.map((x) => (
      <div>
        <Number noPos value={x.value} units={x.units} />
        <Medium>{' ' + x.stat}</Medium>
      </div>
    ))}
  </>
);

const GridCellSpiritDamage = ({value}) => (
  <>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Icon icon="ghetto_spirit_damage.svg" />
      <Bold bright size={22}>{value}</Bold>
    </div>
    <div>
      <Bold color="#c78bf7" size={15}>Damage</Bold>
    </div>
  </>
);

const GridCellWeaponDamage = ({value}) => (
  <>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Icon icon="ghetto_weapon_damage.svg" />
      <Bold bright size={22}>{value}</Bold>
    </div>
    <div>
      <Bold color="#d49f50" size={15}>Damage</Bold>
    </div>
  </>
);

const GridCellConditional = ({icon, value, units, stat, noPos}) => (
  <>
    <div>
      <Icon small icon={icon} />
      <Number noPos={noPos} value={value} units={units} />
    </div>
    <div>
      <SemiBold bright size={15}>{stat}</SemiBold>
    </div>
    <div>
      <SemiBold italic muted size={15}>Conditional</SemiBold>
    </div>
  </>
);

const Active = ({cooldown, description, grid}) => {
  const cellContents = (x) => {
    if (x.type === 'values') {
      return <GridCellValues values={x.values} />;
    } else if (x.type === 'spirit_damage') {
      return <GridCellSpiritDamage value={x.value} />;
    } else if (x.type === 'weapon_damage') {
      return <GridCellWeaponDamage value={x.value} />;
    } else if (x.type === 'conditional') {
      return <GridCellConditional icon={x.icon} value={x.value} units={x.units} stat={x.stat} noPos={x.noPos} />;
    } else {
      return 'undefined';
    }
  };

  console.log(grid);

  const rows = grid.map((x) => (
    <div className="mock-grid-row">
      {x.map((x) => (
        <div className="mock-grid-cell">
          {cellContents(x)}
        </div>
      ))}
    </div>
  ));

  console.log(rows);

  return (
    <div className="mock-active">
      <div className="mock-active-header">
        <div><Bold bright>Active</Bold></div>
        <Cooldown seconds={cooldown} />
      </div>
      <div className="mock-active-description">
        <div><Markdown text={description} /></div>
        <Grid>
          {rows}
        </Grid>
      </div>
    </div>
  );
};

const Passive = () => {
};

render(<Item />, document.getElementById('app'));
