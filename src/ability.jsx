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
  description: "Transform yourself into a tornado that travels forward, **damaging enemies** and **lifting them up in the air**.  After emerging from the tornado you gain **bullet evasion**.",
  grid: [
    [
      {type: "spirit_damage", value: 70, spiritScaling: 0.7},
      {type: "value", value: 1.5, units: "s", stat: "Lift Duration", noPos: true, icon: "duration"},
      {type: "value", value: 30, units: "%", stat: "Bullet Evasion Chance", noPos: true},
    ], [{type: "values", values: [
      {value: 3.5, units: 's', stat: 'Bullet Evasion Duration'},
      {value: 3.5, units: 'm', stat: 'Radius', icon: 'aoe'},
    ]}],
  ],
  upgrades: [
    '**+0.5s**\nLift Duration',
    '**-14s**\nCooldown',
    '**+20%**\nBullet Evasion Chance',
  ],
};

const Header = ({name, cooldown, duration, charges, chargeCooldown, range, aoe}) => {
  return (
    <div className="mock-ability-header">
      <div className="mock-ability-header-title">
        <Bold bright>{name}</Bold>
      </div>
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
        <Bold>{tier}</Bold>
      </div>
      <div className="mock-ability-upgrade-text">
        <Markdown text={text} />
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
          <Markdown text={description} />
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
