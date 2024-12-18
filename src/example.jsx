const HeroicAura = {
  category:   'weapon',
  name:       'Heroic Aura',
  tier:       3,
  components: [],

  stats: [
    {value: 20, units: '%', signed: true, stat: 'Bullet Lifesteal'},
    {value: 150, units: '', signed: true, stat: 'Bonus Health'},
    {value: 1, units: ' m/s', signed: true, stat: 'Move Speed'},
  ],

  effects: [
    {
      active:      false,
      details: {
        description: 'Provides **Fire Rate** to nearby player minions.',
        sections: [{
          gridData: {
            cells:  [{icon: {image: 'stat/fire_rate', color: 'orange'}, value: 40, units: '%', stat: 'Minions Fire Rate', signed: true, conditional: true}],
            values: [{value: 20, units: 'm', stat: 'Radius'}],
          },
        }],
      },
    }, {
      active:      true,
      cooldown:    32,
      details: {
        description: 'Provides bonus **Movement Speed** and **Fire Rate** to you and nearby allies.',
        sections: [{
          gridData: {
            cells: [
              {icon: {image: 'stat/move_speed', color: 'grey'}, value: 2, units: 'm/s', stat: 'Movement Speed', signed: true, conditional: true},
              {icon: {image: 'stat/fire_rate', color: 'orange'}, value: 25, units: '%', stat: 'Fire Rate', signed: true, conditional: true},
            ],
            values: [
              {value: 30, units: 'm', stat: 'Active Radius'},
              {value: 6, units: 's', stat: 'Duration'},
            ],
          },
        }],
      },
    },
  ],
};

const SlowingHex = {
  category: 'spirit',
  name:     'Slowing Hex',
  tier:     2,

  components: ['Enduring Spirit'],

  stats: [
    {value: 10, units: '%', stat: 'Spirit Lifesteal', signed: true},
    {value: 5, units: '', stat: 'Spirit Power', signed: true},
    {value: 75, units: '', stat: 'Bonus Health', signed: true},
  ],

  effects: [
    {
      active:      true,
      cooldown:    26,
      details: {
        description: 'Deals **Spirit Damage**, **Slows** targets movement and dashes.  Also **Silences their movement-based items and abilities.**\n_Does not affect target\'s stamina usage._',
        sections: [{
          gridData: {
            cells: [
              {icon: {image: 'stat/spirit_damage', color: 'purple', large: true}, value: 80, units: '', stat: 'Damage', color: 'purple'},
              {icon: {image: 'stat/move_slow'}, value: 20, units: '%', stat: 'Movement Slow', conditional: true},
              {icon: {image: 'stat/move_slow'}, value: -30, units: '%', stat: 'Dash Distance', signed: true, conditional: true},
            ],
            values: [
              {value: 29, units: 'm', stat: 'Cast Range'},
              {value: 3, units: 's', stat: 'Duration'},
            ],
          },
        }],
      },
    },
  ],
};

const ReturnFire = {
  category: 'vitality',
  name:     'Return Fire',
  tier:     2,

  stats: [
    {value: 125, units: '', stat: 'Bonus Health', signed: true},
    {value: 9, units: '', stat: 'Spirit Power', signed: true},
  ],

  effects: [
    {
      active:      true,
      cooldown:    25,
      details: {
        description: 'Automatically **fire a bullet** towards any attacker who damages you with their abilities or weapon.',
        sections: [{
          gridData: {
            cells: [
              {icon: {image: 'stat/weapon_damage', color: 'orange', large: true}, value: 60, units: '%', stat: 'Bullet Damage Returned', color: 'orange'},
              {icon: {image: 'stat/spirit_damage', color: 'purple', large: true}, value: 30, units: '%', stat: 'Spirit Damage Returned', color: 'purple'},
              {icon: {image: 'stat/bullet_shield', color: 'orange'}, value: 25, units: '%', stat: 'Bullet Resist', signed: true, conditional: true},
            ],
            values: [{value: 7, units: 's', stat: 'Duration'}],
          },
        }],
      },
    },
  ],
};

const Tornado = {
  category:    'ability',
  name:        'Tornado',

  stats: [
    {icon: {image: 'stat/cooldown'}, value: 32, units: 's', stat: 'cooldown'},
    {icon: {image: 'stat/duration'}, value: 0.75, units: 's'},
  ],

  details: {
    description: 'Transform yourself into a tornado that travels forward, **damaging enemies** and **lifting them up in the air**.  After emerging from the tornado you gain **bullet evasion**.',
    sections: [{
      gridData: {
        cells: [
          {icon: {image: 'stat/spirit_damage', color: 'purple'}, value: 70, units: '', stat: 'Damage', spiritScaling: 0.7},
          {value: 1.5, units: 's', stat: 'Lift Duration', icon: {image: 'stat/duration'}},
          {value: 30, units: '%', stat: 'Bullet Evasion Chance', icon: {image: 'stat/placeholder'}},
        ],
        values: [
          {value: 3.5, units: 's', stat: 'Bullet Evasion Duration', icon: {image: 'stat/placeholder'}},
          {value: 3.5, units: 'm', stat: 'Radius', icon: {image: 'stat/aoe'}},
        ],
      },
    }],
  },

  upgrades: [
    '**+0.5s**\nLift Duration',
    '**-14s**\nCooldown',
    '**+20%**\nBullet Evasion Chance',
  ],
};

const examples = [HeroicAura, ReturnFire, SlowingHex, Tornado];
export {examples};
