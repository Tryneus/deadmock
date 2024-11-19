const exampleItem = {
  category: "spirit",
  name: "Slowing Hex",
  cost: 1750,
  tier: 2,
  components: [
    {icon: "item/enduring_spirit", name: "Enduring Spirit", color: "green"},
  ],
  stats: [
    {units: "%", value: 10, stat: "Spirit Lifesteal"},
    {value: 5, stat: "Spirit Power"},
    {value: 75, stat: "Bonus Health"},
  ],
  active: {
    cooldown: 26,
    sections: [{
      description: "Deals **Spirit Damage**, **Slows** targets movement and dashes.  Also **Silences their movement-based items and abilities.**\n_Does not affect target's stamina usage._",
      grid: {
        cells: [
          {icon: {icon: "spirit_damage", color: "purple", size: 22}, value: 80, signed: false, stat: "Damage", color: "purple"},
          {value: 20, units: "%", stat: "Movement Slow", signed: false, icon: {icon: "movement_slow"}, conditional: true},
          {value: -30, units: "%", stat: "Dash Distance", signed: true, icon: {icon: "movement_slow"}, conditional: true},
        ],
        values: [
          {value: 29, units: 'm', stat: 'Cast Range'},
          {value: 3, units: 's', stat: 'Duration'},
        ],
      },
    }],
  },
  passive: {
    cooldown: 10.5,
    sections: [{
      description: "Imbue an ability with **permanent Spirit Power**.  When that ability is used, gain bonus **Movement Speed**.",
      grid: {
        cells: [
          {icon: {icon: "spirit_damage", color: "purple"}, value: 34, signed: true, stat: "Imbued Ability Spirit Power", color: "purple"},
          {icon: {icon: "fire_rate", color: "orange"}, value: 10, signed: false, units: "%", stat: "Fire Rate Bonus", conditional: true},
          {value: 3, signed: true, units: " m/s", stat: "Move Speed", conditional: true},
        ],
        values: [
          {value: 6, units: 's', stat: 'Move Speed Duration'},
        ],
      },
    }],
  },
};

const exampleAbility = {
  name: "Tornado",
  cooldown: 32,
  duration: 0.75,
  chargeCooldown: 4,
  charges: 3,
  aoe: 10,
  description: "Transform yourself into a tornado that travels forward, **damaging enemies** and **lifting them up in the air**.  After emerging from the tornado you gain **bullet evasion**.",
  grid: {
    cells: [
      {icon: {icon: "spirit_damage", color: "purple"}, value: 70, stat: "Damage", signed: false, spiritScaling: 0.7},
      {value: 1.5, units: "s", stat: "Lift Duration", signed: false, icon: {icon: "duration"}},
      {value: 30, units: "%", stat: "Bullet Evasion Chance", signed: false, icon: {icon: 'placeholder'}},
    ],
    values: [
      {value: 3.5, units: 's', stat: 'Bullet Evasion Duration', icon: {icon: 'placeholder'}},
      {value: 3.5, units: 'm', stat: 'Radius', icon: {icon: 'aoe'}},
      {value: 5, units: 's', stat: 'Launch Window', icon: {icon: 'duration'}},
      {value: 25, units: '%', stat: 'Heal vs Non-Heroes', icon: {icon: 'healing'}},
    ],
  },
  upgrades: [
    '**+0.5s**\nLift Duration',
    '**-14s**\nCooldown',
    '**+20%**\nBullet Evasion Chance',
  ],
};

export {exampleItem, exampleAbility};
