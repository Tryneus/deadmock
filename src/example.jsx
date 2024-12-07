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
      description: 'Provides **Fire Rate** to nearby player minions.',

      sections: [
        {
          type: 'grid',
          data: {
            cells:  [{icon: {image: 'stat/fire_rate', color: 'orange'}, value: 40, units: '%', stat: 'Minions Fire Rate', signed: true, weight: 600, conditional: true}],
            values: [{value: 20, units: 'm', signed: false, stat: 'Radius'}],
          },
        },
      ],
    }, {
      active:      true,
      cooldown:    32,
      description: 'Provides bonus **Movement Speed** and **Fire Rate** to you and nearby allies.',

      sections: [
        {
          type: 'grid',
          data: {
            cells: [
              {icon: {image: 'stat/move_speed', color: 'grey'}, value: 2, units: 'm/s', stat: 'Movement Speed', signed: true, weight: 600, conditional: true},
              {icon: {image: 'stat/fire_rate', color: 'orange'}, value: 25, units: '%', stat: 'Fire Rate', signed: true, weight: 600, conditional: true},
            ],
            values: [
              {value: 30, units: 'm', signed: false, stat: 'Active Radius'},
              {value: 6, units: 's', signed: false, stat: 'Duration'},
            ],
          },
        },
      ],
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
      description: 'Deals **Spirit Damage**, **Slows** targets movement and dashes.  Also **Silences their movement-based items and abilities.**\n_Does not affect target\'s stamina usage._',

      sections: [
        {
          type: 'grid',
          data: {
            cells: [
              {icon: {image: 'stat/spirit_damage', color: 'purple', large: true}, value: 80, units: '', weight: 600, signed: false, stat: 'Damage', color: 'purple'},
              {value: 20, units: '%', stat: 'Movement Slow', signed: false, weight: 600, icon: {image: 'stat/move_slow'}, conditional: true},
              {value: -30, units: '%', stat: 'Dash Distance', signed: true, weight: 600, icon: {image: 'stat/move_slow'}, conditional: true},
            ],
            values: [
              {value: 29, units: 'm', stat: 'Cast Range'},
              {value: 3, units: 's', stat: 'Duration'},
            ],
          },
        },
      ],
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
      description: 'Automatically **fire a bullet** towards any attacker who damages you with their abilities or weapon.',

      sections: [
        {
          type: 'grid',
          data: {
            cells: [
              {icon: {image: 'stat/weapon_damage', color: 'orange', large: true}, value: 60, units: '%', weight: 600, signed: false, stat: 'Bullet Damage Returned', color: 'orange'},
              {icon: {image: 'stat/spirit_damage', color: 'purple', large: true}, value: 30, units: '%', weight: 600, signed: false, stat: 'Spirit Damage Returned', color: 'purple'},
              {icon: {image: 'stat/bullet_shield', color: 'orange'}, value: 25, units: '%', stat: 'Bullet Resist', signed: true, weight: 600, conditional: true},
            ],
            values: [{value: 7, units: 's', stat: 'Duration'}],
          },
        },
      ],
    },
  ],
};

const Tornado = {
  category:    'ability',
  name:        'Tornado',
  description: 'Transform yourself into a tornado that travels forward, **damaging enemies** and **lifting them up in the air**.  After emerging from the tornado you gain **bullet evasion**.',

  stats: [
    {icon: {image: 'stat/charge'}, value: 3, units: '', signed: false, stat: 'charges'},
    {icon: {image: 'stat/charge_cooldown'}, value: 4, units: 's', signed: false, stat: 'chargeCooldown'},
    {icon: {image: 'stat/cooldown'}, value: 32, units: 's', signed: false, stat: 'cooldown'},
    {icon: {image: 'stat/duration'}, value: 0.75, units: 's', signed: false},
    {icon: {image: 'stat/aoe'}, value: 10, units: 'm', signed: false},
    {icon: {image: 'stat/range'}, value: 25, units: 'm', signed: false},
  ],

  sections: [
    {
      type: 'grid',
      data: {
        cells: [
          {icon: {image: 'stat/spirit_damage', color: 'purple'}, value: 70, units: '', stat: 'Damage', signed: false, spiritScaling: 0.7},
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
    },
  ],

  upgrades: [
    '**+0.5s**\nLift Duration',
    '**-14s**\nCooldown',
    '**+20%**\nBullet Evasion Chance',
  ],
};

const examples = [HeroicAura, ReturnFire, SlowingHex, Tornado];
export {examples};
