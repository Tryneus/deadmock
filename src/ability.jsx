import classNames from 'classnames';
import {Icon} from './icon';
import {Markdown} from './markdown';
import {Text, Medium, SemiBold, Bold} from './text';
import {Value} from './value';
import {Grid} from './grid';

import './ability.css';

const example = {
  name: "Tornado",
  cooldown: 32,
  duration: 0.75,
  chargeCooldown: 4,
  charges: 3,
  description: "Transform yourself into a tornado that travels forward, **damaging enemies** and **lifting them up in the air**.  After emerging from the tornado you gain **bullet evasion**.",
  grid: [
    [
      {type: "spirit_damage", value: 70, spiritScaling: 0.7},
      {type: "value", value: 1.5, units: "s", stat: "Lift Duration", signed: false, icon: "duration"},
      {type: "value", value: 30, units: "%", stat: "Bullet Evasion Chance", signed: false, icon: 'placeholder'},
    ], [{type: "values", values: [
      {value: 3.5, units: 's', stat: 'Bullet Evasion Duration', icon: 'placeholder'},
      {value: 3.5, units: 'm', stat: 'Radius', icon: 'aoe'},
      {value: 5, units: 's', stat: 'Launch Window', icon: 'duration'},
      {value: 25, units: '%', stat: 'Heal vs Non-Heroes', icon: 'healing'},
    ]}],
  ],
  upgrades: [
    '**+0.5s**\nLift Duration',
    '**-14s**\nCooldown',
    '**+20%**\nBullet Evasion Chance',
  ],
};

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

const headerStatProps = {
  cooldown: {units: 's', icon: 'cooldown'},
  duration: {units: 's', icon: 'duration'},
  charges: {units: '', icon: 'charge'},
  chargeCooldown: {units: 's', icon: 'charge_cooldown'},
  range: {units: 'm', icon: 'range'},
  aoe: {units: 'm', icon: 'aoe'},
};

const Header = ({name, ...props}) => {
  const groupedStatNames = [['charges', 'chargeCooldown'], ['duration'], ['cooldown'], ['range'], ['aoe']];

  const statPropGroups = groupedStatNames.map((group) =>
    group
      .map((name) => ({value: props[name], ...headerStatProps[name]}))
      .filter((x) => (x.value !== undefined))
  ).filter((x) => (x.length > 0));

  const spacer = (statPropGroups.length % 2) === 0 ? <div className="mock-ability-header-spacer" /> : null;

  return (
    <div className="mock-ability-header">
      <div className="mock-ability-header-title">
        <Bold bright>{name}</Bold>
      </div>
      {spacer}
      {statPropGroups.map((group) => {
        return (
          <div className="mock-ability-header-stat-group">
            {group.map((props) => (
              <div className="mock-ability-header-stat">
                <Icon size={18} icon={props.icon} color="grey" />
                &nbsp;
                <Value value={props.value} units={props.units} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

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


const Ability = () => {
  const ability = example;
  const {name, cooldown, duration, charges, chargeCooldown, range, aoe, description, grid, upgrades} = ability;
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
