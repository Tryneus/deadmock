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
          {type: "spirit_damage", value: 80},
          {type: "conditional", value: 20, units: "%", stat: "Movement Slow", signed: false, icon: "movement_slow"},
          {type: "conditional", value: -30, units: "%", stat: "Dash Distance", signed: false, icon: "movement_slow"},
        ],
        values: [
          {value: 29, units: 'm', stat: 'Cast Range'},
          {value: 3, units: 's', stat: 'Duration'},
        ],
      },
    }],
  },
  passive: null,
};

const exampleAbility = {
  name: "Tornado",
  cooldown: 32,
  duration: 0.75,
  chargeCooldown: 4,
  charges: 3,
  description: "Transform yourself into a tornado that travels forward, **damaging enemies** and **lifting them up in the air**.  After emerging from the tornado you gain **bullet evasion**.",
  grid: {
    cells: [
      {type: "spirit_damage", value: 70, spiritScaling: 0.7},
      {type: "value", value: 1.5, units: "s", stat: "Lift Duration", signed: false, icon: "duration"},
      {type: "value", value: 30, units: "%", stat: "Bullet Evasion Chance", signed: false, icon: 'placeholder'},
    ],
    values: [
      {value: 3.5, units: 's', stat: 'Bullet Evasion Duration', icon: 'placeholder'},
      {value: 3.5, units: 'm', stat: 'Radius', icon: 'aoe'},
      {value: 5, units: 's', stat: 'Launch Window', icon: 'duration'},
      {value: 25, units: '%', stat: 'Heal vs Non-Heroes', icon: 'healing'},
    ],
  },
  upgrades: [
    '**+0.5s**\nLift Duration',
    '**-14s**\nCooldown',
    '**+20%**\nBullet Evasion Chance',
  ],
};

export {exampleItem, exampleAbility};
