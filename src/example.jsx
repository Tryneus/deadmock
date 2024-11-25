import {AbilityState, ItemState} from './state';

const exampleItem = new ItemState({
  category: 'spirit',
  name:     'Slowing Hex',
  cost:     1750,
  tier:     2,

  components: ['Enduring Spirit'],

  stats: [
    {units: '%', value: 10, stat: 'Spirit Lifesteal', signed: true},
    {value: 5, stat: 'Spirit Power', signed: true},
    {value: 75, stat: 'Bonus Health', signed: true},
  ],

  effects: [
    {
      active:   true,
      cooldown: 26,

      sections: [
        {
          type: 'markdown',
          data: 'Deals **Spirit Damage**, **Slows** targets movement and dashes.  Also **Silences their movement-based items and abilities.**\n_Does not affect target\'s stamina usage._',
        }, {
          type: 'grid',
          data: {
            cells: [
              {icon: {image: 'stat/spirit_damage', color: 'purple', size: 22}, value: 80, signed: false, stat: 'Damage', color: 'purple'},
              {value: 20, units: '%', stat: 'Movement Slow', signed: false, icon: {image: 'stat/movement_slow'}, conditional: true},
              {value: -30, units: '%', stat: 'Dash Distance', signed: true, icon: {image: 'stat/movement_slow'}, conditional: true},
            ],
            values: [
              {value: 29, units: 'm', stat: 'Cast Range'},
              {value: 3, units: 's', stat: 'Duration'},
            ],
          },
        },
      ],
    }, {
      active:   false,
      cooldown: 10.5,

      sections: [
        {
          type: 'markdown',
          data: 'Imbue an ability with **permanent Spirit Power**.  When that ability is used, gain bonus **Movement Speed**.',
        }, {
          type: 'grid',
          data: {
            cells: [
              {icon: {image: 'stat/spirit_damage', color: 'purple'}, value: 34, signed: true, stat: 'Imbued Ability Spirit Power', color: 'purple'},
              {icon: {image: 'stat/fire_rate', color: 'orange'}, value: 10, signed: false, units: '%', stat: 'Fire Rate Bonus', conditional: true},
              {icon: {image: 'stat/move_speed'}, value: 3, signed: true, units: 'm/s', stat: 'Move Speed', conditional: true},
            ],
            values: [{value: 6, units: 's', stat: 'Move Speed Duration'}],
          },
        },
      ],
    },
  ],
});

const exampleAbility = new AbilityState({
  name:        'Tornado',
  description: 'Transform yourself into a tornado that travels forward, **damaging enemies** and **lifting them up in the air**.  After emerging from the tornado you gain **bullet evasion**.',

  headerStats: [
    {icon: {image: 'stat/charge'}, value: 3, signed: false, stat: 'charges'},
    {icon: {image: 'stat/charge_cooldown'}, value: 4, units: 's', signed: false, stat: 'chargeCooldown'},
    {icon: {image: 'stat/cooldown'}, value: 32, units: 's', signed: false, stat: 'cooldown'},
    {icon: {image: 'stat/duration'}, value: 0.75, units: 's', signed: false},
    {icon: {image: 'stat/aoe'}, value: 10, units: 'm', signed: false},
    {icon: {image: 'stat/range'}, value: 25, units: 'm', signed: false},
  ],

  grid: {
    cells: [
      {icon: {image: 'stat/spirit_damage', color: 'purple'}, value: 70, stat: 'Damage', signed: false, spiritScaling: 0.7},
      {value: 1.5, units: 's', stat: 'Lift Duration', signed: false, icon: {image: 'stat/duration'}},
      {value: 30, units: '%', stat: 'Bullet Evasion Chance', signed: false, icon: {image: 'stat/placeholder'}},
    ],
    values: [
      {value: 3.5, units: 's', stat: 'Bullet Evasion Duration', icon: {image: 'stat/placeholder'}},
      {value: 3.5, units: 'm', stat: 'Radius', icon: {image: 'stat/aoe'}},
      {value: 5, units: 's', stat: 'Launch Window', icon: {image: 'stat/duration'}},
      {value: 25, units: '%', stat: 'Heal vs Non-Heroes', icon: {image: 'stat/healing'}},
    ],
  },

  upgrades: [
    '**+0.5s**\nLift Duration',
    '**-14s**\nCooldown',
    '**+20%**\nBullet Evasion Chance',
  ],
});

export {exampleAbility, exampleItem};
