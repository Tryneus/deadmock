const HeroicAuraHydrated = {
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
          cells:  [{icon: {image: 'stat/fire_rate', color: 'orange'}, value: 40, units: '%', stat: 'Minions Fire Rate', signed: true, conditional: true}],
          values: [{value: 20, units: 'm', stat: 'Radius'}],
        },
      ],
    }, {
      active:      true,
      cooldown:    32,
      description: 'Provides bonus **Movement Speed** and **Fire Rate** to you and nearby allies.',

      sections: [
        {
          cells: [
            {icon: {image: 'stat/move_speed', color: 'grey'}, value: 2, units: 'm/s', stat: 'Movement Speed', signed: true, conditional: true},
            {icon: {image: 'stat/fire_rate', color: 'orange'}, value: 25, units: '%', stat: 'Fire Rate', signed: true, conditional: true},
          ],
          values: [
            {value: 30, units: 'm', stat: 'Active Radius'},
            {value: 6, units: 's', stat: 'Duration'},
          ],
        },
      ],
    },
  ],
};

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const HeroicAuraSerialized = ['weapon','Heroic Aura',3,[],[[[],'Bullet Lifesteal',20,'%',1],[[],'Bonus Health',150,'',1],[[],'Move Speed',1,' m/s',1]],[['Provides **Fire Rate** to nearby player minions.',[[[[['stat/fire_rate','orange'],'Minions Fire Rate',40,'%',1,0,1]],[[[],'Radius',20,'m']]]]],['Provides bonus **Movement Speed** and **Fire Rate** to you and nearby allies.',[[[[['stat/move_speed'],'Movement Speed',2,'m/s',1,0,1],[['stat/fire_rate','orange'],'Fire Rate',25,'%',1,0,1]],[[[],'Active Radius',30,'m'],[[],'Duration',6,'s']]]],1,32]]];

const SlowingHexHydrated = {
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
      ],
    },
  ],
};

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const ReturnFireSerialized = ['vitality','Return Fire',2,[],[[[],'Bonus Health',125,'',1],[[],'Spirit Power',9,'',1]],[['Automatically **fire a bullet** towards any attacker who damages you with their abilities or weapon.',[[[[['stat/weapon_damage','orange',1],'Bullet Damage Returned',60,'%',0,0,0,0,'orange'],[['stat/spirit_damage','purple',1],'Spirit Damage Returned',30,'%',0,0,0,0,'purple'],[['stat/bullet_shield','orange'],'Bullet Resist',25,'%',1,0,1]],[[[],'Duration',7,'s']]]],1,25]]];

const ReturnFireHydrated = {
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
          cells: [
            {icon: {image: 'stat/weapon_damage', color: 'orange', large: true}, value: 60, units: '%', stat: 'Bullet Damage Returned', color: 'orange'},
            {icon: {image: 'stat/spirit_damage', color: 'purple', large: true}, value: 30, units: '%', stat: 'Spirit Damage Returned', color: 'purple'},
            {icon: {image: 'stat/bullet_shield', color: 'orange'}, value: 25, units: '%', stat: 'Bullet Resist', signed: true, conditional: true},
          ],
          values: [{value: 7, units: 's', stat: 'Duration'}],
        },
      ],
    },
  ],
};

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const SlowingHexSerialized = ['spirit','Slowing Hex',2,['Enduring Spirit'],[[[],'Spirit Lifesteal',10,'%',1],[[],'Spirit Power',5,'',1],[[],'Bonus Health',75,'',1]],[['Deals **Spirit Damage**, **Slows** targets movement and dashes.  Also **Silences their movement-based items and abilities.**\n_Does not affect target\'s stamina usage._',[[[[['stat/spirit_damage','purple',1],'Damage',80,'',0,0,0,0,'purple'],[['stat/move_slow'],'Movement Slow',20,'%',0,0,1],[['stat/move_slow'],'Dash Distance',-30,'%',1,0,1]],[[[],'Cast Range',29,'m'],[[],'Duration',3,'s']]]],1,26]]];

const TornadoHydrated = {
  category:    'ability',
  name:        'Tornado',
  description: 'Transform yourself into a tornado that travels forward, **damaging enemies** and **lifting them up in the air**.  After emerging from the tornado you gain **bullet evasion**.',

  stats: [
    {icon: {image: 'stat/cooldown'}, value: 32, units: 's', stat: 'cooldown'},
    {icon: {image: 'stat/duration'}, value: 0.75, units: 's'},
  ],

  sections: [
    {
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
  ],

  upgrades: [
    '**+0.5s**\nLift Duration',
    '**-14s**\nCooldown',
    '**+20%**\nBullet Evasion Chance',
  ],
};

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const TornadoSerialized = ['ability','Tornado',[[['stat/cooldown'],'cooldown',32,'s'],[['stat/duration'],'stat',0.75,'s']],'Transform yourself into a tornado that travels forward, **damaging enemies** and **lifting them up in the air**.  After emerging from the tornado you gain **bullet evasion**.',[[[[['stat/spirit_damage','purple'],'Damage',70,'',0,0.7],[['stat/duration'],'Lift Duration',1.5,'s'],[[],'Bullet Evasion Chance',30,'%']],[[[],'Bullet Evasion Duration',3.5,'s'],[['stat/aoe'],'Radius',3.5,'m']]]],['**+0.5s**\nLift Duration', '**-14s**\nCooldown', '**+20%**\nBullet Evasion Chance']];

const snapshots = {
  HeroicAura: {hydrated: HeroicAuraHydrated, serialized: HeroicAuraSerialized},
  ReturnFire: {hydrated: ReturnFireHydrated, serialized: ReturnFireSerialized},
  SlowingHex: {hydrated: SlowingHexHydrated, serialized: SlowingHexSerialized},
  Tornado:    {hydrated: TornadoHydrated, serialized: TornadoSerialized},
};

export {snapshots};
export default {snapshots};
