const HeroicAuraHydrated = {
  category:   'weapon',
  name:       'Heroic Aura',
  tier:       3,
  components: [],

  stats: [
    {value: 20, units: '%', signed: true, stat: 'Bullet Lifesteal'},
    {value: 150, signed: true, stat: 'Bonus Health'},
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

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const HeroicAuraSerialized = ['weapon','Heroic Aura',3,[],[[[],'Bullet Lifesteal',20,'%',1],[[],'Bonus Health',150,'',1],[[],'Move Speed',1,' m/s',1]],[[['Provides **Fire Rate** to nearby player minions.',[[[[[['stat/fire_rate','orange'],'Minions Fire Rate',40,'%',1,0,1]],[[[],'Radius',20,'m']]]]]]],[['Provides bonus **Movement Speed** and **Fire Rate** to you and nearby allies.',[[[[[['stat/move_speed'],'Movement Speed',2,'m/s',1,0,1],[['stat/fire_rate','orange'],'Fire Rate',25,'%',1,0,1]],[[[],'Active Radius',30,'m'],[[],'Duration',6,'s']]]]]],1,32]]];

const HollowPointWardHydrated = {
  category: 'weapon',
  name:     'Hollow Point Ward',
  tier:     1,

  stats: [
    {value: 95, stat: 'Spirit Shield Health', signed: true},
    {value: 4, stat: 'Spirit Power', signed: true},
  ],

  effects: [{
    active: false,

    details: {
      description: 'When you are **above 65% health**, deal additional **Weapon Damage**.',

      sections: [{
        gridData: {
          cells: [
            {icon: {image: 'stat/weapon_damage', color: 'orange'}, value: 20, units: '%', stat: 'Weapon Damage', color: 'orange', signed: true, conditional: true},
          ],
        },
      }],
    },
  }],
};

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const HollowPointWardSerialized = ['weapon','Hollow Point Ward',1,[],[[[],'Spirit Shield Health',95,'',1],[[],'Spirit Power',4,'',1]],[[['When you are **above 65% health**, deal additional **Weapon Damage**.',[[[[[['stat/weapon_damage','orange'],'Weapon Damage',20,'%',1,0,1,0,'orange']],[]]]]]]]];

const SlowingHexHydrated = {
  category: 'spirit',
  name:     'Slowing Hex',
  tier:     2,

  components: ['Enduring Spirit'],

  stats: [
    {value: 10, units: '%', stat: 'Spirit Lifesteal', signed: true},
    {value: 5, stat: 'Spirit Power', signed: true},
    {value: 75, stat: 'Bonus Health', signed: true},
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
              {icon: {image: 'stat/spirit_damage', color: 'purple', large: true}, value: 80, stat: 'Damage', color: 'purple'},
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

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const ReturnFireSerialized = ['vitality','Return Fire',2,[],[[[],'Bonus Health',125,'',1],[[],'Spirit Power',9,'',1]],[[['Automatically **fire a bullet** towards any attacker who damages you with their abilities or weapon.',[[[[[['stat/weapon_damage','orange',1],'Bullet Damage Returned',60,'%',0,0,0,0,'orange'],[['stat/spirit_damage','purple',1],'Spirit Damage Returned',30,'%',0,0,0,0,'purple'],[['stat/bullet_shield','orange'],'Bullet Resist',25,'%',1,0,1]],[[[],'Duration',7,'s']]]]]],1,25]]];

const ReturnFireHydrated = {
  category: 'vitality',
  name:     'Return Fire',
  tier:     2,

  stats: [
    {value: 125, stat: 'Bonus Health', signed: true},
    {value: 9, stat: 'Spirit Power', signed: true},
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

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const SlowingHexSerialized = ['spirit','Slowing Hex',2,['Enduring Spirit'],[[[],'Spirit Lifesteal',10,'%',1],[[],'Spirit Power',5,'',1],[[],'Bonus Health',75,'',1]],[[['Deals **Spirit Damage**, **Slows** targets movement and dashes.  Also **Silences their movement-based items and abilities.**\n_Does not affect target\'s stamina usage._',[[[[[['stat/spirit_damage','purple',1],'Damage',80,'',0,0,0,0,'purple'],[['stat/move_slow'],'Movement Slow',20,'%',0,0,1],[['stat/move_slow'],'Dash Distance',-30,'%',1,0,1]],[[[],'Cast Range',29,'m'],[[],'Duration',3,'s']]]]]],1,26]]];

// Include Shadow Weave because it has multiple sections in its effect, which is rare or unique.
const ShadowWeaveHydrated = {
  category: 'weapon',
  name:     'Shadow Weave',
  tier:     4,

  stats: [
    {signed: true, value: 15, stat: 'Health Regen'},
    {signed: true, value: 300, stat: 'Spirit Shield Health'},
    {signed: true, value: 30, units: '%', stat: 'Ammo'},
  ],

  effects: [{
    active:   true,
    cooldown: 48,
    details:  {
      description: 'Become **Stealthed**. Whenever you take damage while Stealthed you get briefly revealed.',

      sections: [
        {
          gridData: {
            cells: [
              {icon: {image: 'stat/invisible'}, conditional: true, value: 25, units: 's', stat: 'Invisibility'},
            ],
            values: [
              {value: 26, units: 'm', stat: 'Spot Radius'},
            ],
          },
        }, {
          markdownData: 'Attacking or using an ability will end your stealth and start an **ambush**, temporarily granting your bonus **Fire Rate** and **Spirit Power**.',
        }, {
          gridData: {
            cells: [
              {icon: {image: 'stat/weapon_damage', color: 'orange'}, signed: true, conditional: true, value: 30, units: '%', stat: 'Ambush Fire Rate', color: 'orange'},
              {icon: {image: 'stat/spirit_damage', color: 'purple'}, signed: true, conditional: true, value: 55, units: '', stat: 'Ambush Spirit Power', color: 'purple'},
            ],
            values: [
              {value: 8, units: 's', stat: 'Ambush Duration'},
            ],
          },
        },
      ],
    },
  }],
};

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const ShadowWeaveSerialized = ['weapon','Shadow Weave',4,[],[[[],'Health Regen',15,'',1],[[],'Spirit Shield Health',300,'',1],[[],'Ammo',30,'%',1]],[[['Become **Stealthed**. Whenever you take damage while Stealthed you get briefly revealed.',[[[[[['stat/invisible'],'Invisibility',25,'s',0,0,1]],[[[],'Spot Radius',26,'m']]]],[0,'Attacking or using an ability will end your stealth and start an **ambush**, temporarily granting your bonus **Fire Rate** and **Spirit Power**.'],[[[[['stat/weapon_damage','orange'],'Ambush Fire Rate',30,'%',1,0,1,0,'orange'],[['stat/spirit_damage','purple'],'Ambush Spirit Power',55,'',1,0,1,0,'purple']],[[[],'Ambush Duration',8,'s']]]]]],1,48]]];

const TornadoHydrated = {
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
          {icon: {image: 'stat/spirit_damage', color: 'purple'}, value: 70, stat: 'Damage', spiritScaling: 0.7},
          {value: 1.5, units: 's', stat: 'Lift Duration', icon: {image: 'stat/duration'}},
          {value: 30, units: '%', stat: 'Bullet Evasion Chance'},
        ],
        values: [
          {value: 3.5, units: 's', stat: 'Bullet Evasion Duration'},
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

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const TornadoSerialized = ['ability','Tornado',[[['stat/cooldown'],'cooldown',32,'s'],[['stat/duration'],0,0.75,'s']],['Transform yourself into a tornado that travels forward, **damaging enemies** and **lifting them up in the air**.  After emerging from the tornado you gain **bullet evasion**.',[[[[[['stat/spirit_damage','purple'],'Damage',70,'',0,0.7],[['stat/duration'],'Lift Duration',1.5,'s'],[[],'Bullet Evasion Chance',30,'%']],[[[],'Bullet Evasion Duration',3.5,'s'],[['stat/aoe'],'Radius',3.5,'m']]]]]],['**+0.5s**\nLift Duration','**-14s**\nCooldown','**+20%**\nBullet Evasion Chance']];

const DynamoHydrated = {
  category:    'hero',
  name:        'Dynamo',
  portrait:    'dynamo.webp',
  tagline:     'Locks down the enemy team',
  description: 'Dynamo keeps himself and his allies healthy while waiting for his moment. Few things can warp a team fight more than a well coordinated use of Singularity.',

  abilities: [
    {id: 'KineticPulse', image: 'hero/dynamo/kinetic_pulse'},
    {id: 'QuantumEntanglement', image: 'hero/dynamo/quantum_entanglement'},
    {id: 'RejuvenatingAurora', image: 'hero/dynamo/rejuvenating_aurora'},
    {id: 'Singularity', image: 'hero/dynamo/singularity'},
  ],

  statGroups: [{
    label: 'Weapon',
    color: 'orange',
    stats: [
      {icon: {image: 'stat/weapon_damage', color: 'orange'}, value: 60, units: '', stat: 'DPS'},
      {icon: {image: 'stat/bullet', color: 'orange'}, value: 15, units: '', stat: 'Bullet Damage'},
      {icon: {image: 'stat/ammo'}, value: 18, units: '', stat: 'Ammo'},
      {icon: {image: 'stat/fire_rate'}, value: 4, units: '', stat: 'Bullets per sec'},
      {icon: {image: 'stat/melee', color: 'orange'}, value: 63, units: '', stat: 'Light Melee'},
      {icon: {image: 'stat/melee', color: 'orange'}, value: 116, units: '', stat: 'Heavy Melee'},
    ],
  }, {
    label: 'Vitality',
    color: 'green',
    stats: [
      {icon: {image: 'stat/health'}, value: 650, units: '', stat: 'Max Health'},
      {icon: {image: 'stat/healing'}, value: 2, units: '', stat: 'Health Regen'},
      {icon: {image: 'stat/bullet_armor'}, value: 0, units: '%', stat: 'Bullet Resist'},
      {icon: {image: 'stat/spirit_armor'}, value: 0, units: '%', stat: 'Spirit Resist'},
      {icon: {image: 'stat/move_speed'}, value: 6.5, units: ' m/s', stat: 'Move Speed'},
      {icon: {image: 'stat/move_speed'}, signed: true, value: 0, units: ' m/s', stat: 'Sprint Speed'},
      {icon: {image: 'stat/stamina'}, value: 3, units: '', stat: 'Stamina'},
    ],
  }],
};

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const DynamoSerialized = ['hero','Dynamo','Locks down the enemy team','Dynamo keeps himself and his allies healthy while waiting for his moment. Few things can warp a team fight more than a well coordinated use of Singularity.','dynamo.webp',[['Weapon','orange',[[['stat/weapon_damage','orange'],'DPS',60,''],[['stat/bullet','orange'],'Bullet Damage',15,''],[['stat/ammo'],'Ammo',18,''],[['stat/fire_rate'],'Bullets per sec',4,''],[['stat/melee','orange'],'Light Melee',63,''],[['stat/melee','orange'],'Heavy Melee',116,'']]],['Vitality','green',[[['stat/health'],'Max Health',650,''],[['stat/healing'],'Health Regen',2,''],[['stat/bullet_armor'],'Bullet Resist',0,'%'],[['stat/spirit_armor'],'Spirit Resist',0,'%'],[['stat/move_speed'],'Move Speed',6.5,' m/s'],[['stat/move_speed'],'Sprint Speed',0,' m/s',1],[['stat/stamina'],'Stamina',3,'']]]],[['KineticPulse','hero/dynamo/kinetic_pulse'],['QuantumEntanglement','hero/dynamo/quantum_entanglement'],['RejuvenatingAurora','hero/dynamo/rejuvenating_aurora'],['Singularity','hero/dynamo/singularity']]];

const KineticPulseHydrated = {
  category:    'ability',
  name:        'Kinetic Pulse',

  stats: [
    {icon: {image: 'stat/cooldown'}, value: 25, units: 's', stat: 'cooldown'},
    {icon: {image: 'stat/charge'}, value: 1, units: '', stat: 'charges'},
    {icon: {image: 'stat/charge_cooldown'}, value: 5, units: 's', stat: 'chargeCooldown'},
  ],

  details: {
    description: 'Release an energy pulse that knocks enemies up into the air.',

    sections: [{
      gridData: {
        cells: [
          {icon: {image: 'stat/spirit_damage', color: 'purple'}, value: 100, stat: 'Damage', spiritScaling: 1.4},
          {icon: {image: 'stat/aoe'}, value: 15, units: 'm', stat: 'Stomp Range', spiritScaling: 0.275},
        ],
        values: [
          {icon: {image: 'stat/aoe'}, value: 5, units: 'm', stat: 'Ability Width'},
        ],
      },
    }],
  },

  upgrades: [
    'Hit enemies are **fire rate and movement slowed** by **35%** for **4s**.',
    'Dynamo deals **30% more Weapon Damage** to hit enemies for **8s**',
    '**+125**\nDamage',
  ],
};

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const KineticPulseSerialized = ['ability','Kinetic Pulse',[[['stat/cooldown'],'cooldown',25,'s'],[['stat/charge'],'charges',1,''],[['stat/charge_cooldown'],'chargeCooldown',5,'s']],['Release an energy pulse that knocks enemies up into the air.',[[[[[['stat/spirit_damage','purple'],'Damage',100,'',0,1.4],[['stat/aoe'],'Stomp Range',15,'m',0,0.275]],[[['stat/aoe'],'Ability Width',5,'m']]]]]],['Hit enemies are **fire rate and movement slowed** by **35%** for **4s**.','Dynamo deals **30% more Weapon Damage** to hit enemies for **8s**','**+125**\nDamage']];

const QuantumEntanglementHydrated = {
  category:    'ability',
  name:        'Quantum Entanglement',

  stats: [
    {icon: {image: 'stat/cooldown'}, value: 11, units: 's', stat: 'cooldown'},
    {icon: {image: 'stat/range'}, value: 9, units: 'm'},
  ],

  details: {
    description: 'Dynamo briefly **disappears into the void** and then reappears a short distance away.  On reappearing, your weapon is **reloaded** and has a **fire rate bonus** for the next clip (Max 8s).  Can be Alt-Cast to also bring nearby allies and give them half fire rate bonus.',

    sections: [{
      gridData: {
        cells: [
          {icon: {image: 'stat/duration'}, value: 1.4, units: 's', stat: 'Void Time'},
          {icon: {image: 'stat/aoe'}, value: 9, units: 'm', stat: 'Ally Distance'},
          {icon: {image: 'stat/fire_rate'}, value: 25, units: '%', stat: 'Fire Rate Bonus'},
        ],
      },
    }],
  },

  upgrades: [
    '**+4m**\nCast Range',
    '**+25%**\nFire Rate Bonus',
    'On reappearing, **+120%** base ammo',
  ],
};

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const QuantumEntanglementSerialized = ['ability','Quantum Entanglement',[[['stat/cooldown'],'cooldown',11,'s'],[['stat/range'],0,9,'m']],['Dynamo briefly **disappears into the void** and then reappears a short distance away.  On reappearing, your weapon is **reloaded** and has a **fire rate bonus** for the next clip (Max 8s).  Can be Alt-Cast to also bring nearby allies and give them half fire rate bonus.',[[[[[['stat/duration'],'Void Time',1.4,'s'],[['stat/aoe'],'Ally Distance',9,'m'],[['stat/fire_rate'],'Fire Rate Bonus',25,'%']],[]]]]],['**+4m**\nCast Range','**+25%**\nFire Rate Bonus','On reappearing, **+120%** base ammo']];

const RejuvenatingAuroraHydrated = {
  category:    'ability',
  name:        'Rejuvenating Aurora',

  stats: [
    {icon: {image: 'stat/cooldown'}, value: 45, units: 's', stat: 'cooldown'},
  ],

  details: {
    description: 'While channelling, **restore health over time** to you and any allies nearby.',

    sections: [{
      gridData: {
        cells: [
          {icon: {image: 'stat/healing'}, value: 32, units: '/s', stat: 'Health Restored', spiritScaling: 0.45},
          {icon: {image: 'stat/charge'}, value: 5, units: 's', stat: 'Channel Duration'},
        ],
        values: [
          {icon: {image: 'stat/aoe'}, value: 8, units: 'm', stat: 'Friendly Heal Radius'},
        ],
      },
    }],
  },

  upgrades: [
    'Gain **+4m/s movespeed bonus** for 8s if Aurora is fully channeled.  Gain instantly with 5AP Upgrade.',
    '**-15s**\nCooldown',
    '**Full move and ability use** and additionally heals **+4% of Max Health** per second',
  ],
};

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const RejuvenatingAuroraSerialized = ['ability','Rejuvenating Aurora',[[['stat/cooldown'],'cooldown',45,'s']],['While channelling, **restore health over time** to you and any allies nearby.',[[[[[['stat/healing'],'Health Restored',32,'/s',0,0.45],[['stat/charge'],'Channel Duration',5,'s']],[[['stat/aoe'],'Friendly Heal Radius',8,'m']]]]]],['Gain **+4m/s movespeed bonus** for 8s if Aurora is fully channeled.  Gain instantly with 5AP Upgrade.','**-15s**\nCooldown','**Full move and ability use** and additionally heals **+4% of Max Health** per second']];

const SingularityHydrated = {
  category:    'ability',
  name:        'Singularity',

  stats: [
    {icon: {image: 'stat/cooldown'}, value: 180, units: 's', stat: 'cooldown'},
  ],

  details: {
    description: 'Create a singularity in your hands that **pulls in nearby enemies and damages them**. Once it\'s finished, enemies get knocked into the air.',

    sections: [{
      gridData: {
        cells: [
          {icon: {image: 'stat/charge'}, value: 2.75, units: 's', stat: 'Channel Duration'},
          {icon: {image: 'stat/spirit_damage', color: 'purple'}, value: 60, stat: 'DPS', spiritScaling: 0.21},
        ],
        values: [
          {icon: {image: 'stat/aoe'}, value: 8, units: 'm', stat: 'Singularity Radius'},
        ],
      },
    }],
  },

  upgrades: [
    '**+2m**\nSingularity Radius',
    '**+0.75s**\nChannel Duration',
    'Singularity takes **3.8%** of the enemies\' max health each second.',
  ],
};

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const SingularitySerialized = ['ability','Singularity',[[['stat/cooldown'],'cooldown',180,'s']],['Create a singularity in your hands that **pulls in nearby enemies and damages them**. Once it\'s finished, enemies get knocked into the air.',[[[[[['stat/charge'],'Channel Duration',2.75,'s'],[['stat/spirit_damage','purple'],'DPS',60,'',0,0.21]],[[['stat/aoe'],'Singularity Radius',8,'m']]]]]],['**+2m**\nSingularity Radius','**+0.75s**\nChannel Duration','Singularity takes **3.8%** of the enemies\' max health each second.']];

const MeleeScalingHydrated = {
  category:    'ability',
  name:        'MeleeScaling',
  stats: [],
  details: {
    description: 'words',
    sections: [{
      gridData: {
        cells: [
          {icon: {image: 'stat/ammo'}, value: 1, units: 's', stat: 'Stuff', meleeScaling: 1.5},
        ],
      },
    }],
  },
  upgrades: ['one', 'two', 'three'],
};

/* eslint-disable-next-line @stylistic/js/comma-spacing */
const MeleeScalingSerialized = ['ability','MeleeScaling',[],['words',[[[[[['stat/ammo'],'Stuff',1,'s',0,0,0,0,0,1.5]],[]]]]],['one','two','three']];

const snapshots = {
  HeroicAura:          {hydrated: HeroicAuraHydrated, serialized: HeroicAuraSerialized},
  HollowPointWard:     {hydrated: HollowPointWardHydrated, serialized: HollowPointWardSerialized},
  ReturnFire:          {hydrated: ReturnFireHydrated, serialized: ReturnFireSerialized},
  SlowingHex:          {hydrated: SlowingHexHydrated, serialized: SlowingHexSerialized},
  ShadowWeave:         {hydrated: ShadowWeaveHydrated, serialized: ShadowWeaveSerialized},
  Tornado:             {hydrated: TornadoHydrated, serialized: TornadoSerialized},
  Dynamo:              {hydrated: DynamoHydrated, serialized: DynamoSerialized},
  KineticPulse:        {hydrated: KineticPulseHydrated, serialized: KineticPulseSerialized},
  QuantumEntanglement: {hydrated: QuantumEntanglementHydrated, serialized: QuantumEntanglementSerialized},
  RejuvenatingAurora:  {hydrated: RejuvenatingAuroraHydrated, serialized: RejuvenatingAuroraSerialized},
  Singularity:         {hydrated: SingularityHydrated, serialized: SingularitySerialized},
  MeleeScaling:        {hydrated: MeleeScalingHydrated, serialized: MeleeScalingSerialized},
};

export {snapshots};
export default {snapshots};
