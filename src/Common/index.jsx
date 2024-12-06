import {action} from 'mobx';
import {useCallback} from 'preact/hooks';

// eslint-disable-next-line react-hooks/exhaustive-deps
const useAction = (cb, deps) => useCallback(action(cb), deps);

const deepCopy = (x) => JSON.parse(JSON.stringify(x));

const WEAPON_CATEGORY = 'weapon';
const VITALITY_CATEGORY = 'vitality';
const SPIRIT_CATEGORY = 'spirit';

const allItems = [
  {name: 'Basic Magazine', tier: 1, cost:  500, category: WEAPON_CATEGORY, active: false, icon: 'item/basic_magazine'},
  {name: 'Close Quarters', tier: 1, cost:  500, category: WEAPON_CATEGORY, active: false, icon: 'item/close_quarters'},
  {name: 'Headshot Booster', tier: 1, cost:  500, category: WEAPON_CATEGORY, active: false, icon: 'item/headshot_booster'},
  {name: 'High-Velocity Mag', tier: 1, cost:  500, category: WEAPON_CATEGORY, active: false, icon: 'item/high_velocity_mag'},
  {name: 'Hollow Point Ward', tier: 1, cost:  500, category: WEAPON_CATEGORY, active: false, icon: 'item/hollow_point_ward'},
  {name: 'Monster Rounds', tier: 1, cost:  500, category: WEAPON_CATEGORY, active: false, icon: 'item/monster_rounds'},
  {name: 'Rapid Rounds', tier: 1, cost:  500, category: WEAPON_CATEGORY, active: false, icon: 'item/rapid_rounds'},
  {name: 'Restorative Shot', tier: 1, cost:  500, category: WEAPON_CATEGORY, active: false, icon: 'item/restorative_shot'},
  {name: 'Active Reload', tier: 2, cost: 1250, category: WEAPON_CATEGORY, active: false, icon: 'item/active_reload'},
  {name: 'Berserker', tier: 2, cost: 1250, category: WEAPON_CATEGORY, active: false, icon: 'item/berserker'},
  {name: 'Fleetfoot', tier: 2, cost: 1250, category: WEAPON_CATEGORY, active: true, icon: 'item/fleetfoot'},
  {name: 'Kinetic Dash', tier: 2, cost: 1250, category: WEAPON_CATEGORY, active: false, icon: 'item/kinetic_dash'},
  {name: 'Long Range', tier: 2, cost: 1250, category: WEAPON_CATEGORY, active: false, icon: 'item/long_range'},
  {name: 'Melee Charge', tier: 2, cost: 1250, category: WEAPON_CATEGORY, active: false, icon: 'item/melee_charge'},
  {name: 'Mystic Shot', tier: 2, cost: 1250, category: WEAPON_CATEGORY, active: false, icon: 'item/mystic_shot'},
  {name: 'Slowing Bullets', tier: 2, cost: 1250, category: WEAPON_CATEGORY, active: false, icon: 'item/slowing_bullets'},
  {name: 'Soul Shredder Bullets', tier: 2, cost: 1250, category: WEAPON_CATEGORY, active: false, icon: 'item/soul_shredder_bullets'},
  {name: 'Swift Striker', tier: 2, cost: 1250, category: WEAPON_CATEGORY, active: false, icon: 'item/swift_striker'},
  {name: 'Alchemical Fire', tier: 3, cost: 3000, category: WEAPON_CATEGORY, active: true, icon: 'item/alchemical_fire'},
  {name: 'Burst Fire', tier: 3, cost: 3000, category: WEAPON_CATEGORY, active: false, icon: 'item/burst_fire'},
  {name: 'Escalating Resilience', tier: 3, cost: 3000, category: WEAPON_CATEGORY, active: false, icon: 'item/escalating_resilience'},
  {name: 'Headhunter', tier: 3, cost: 3500, category: WEAPON_CATEGORY, active: false, icon: 'item/headhunter'},
  {name: 'Heroic Aura', tier: 3, cost: 3000, category: WEAPON_CATEGORY, active: true, icon: 'item/heroic_aura'},
  {name: 'Hunter\'s Aura', tier: 3, cost: 3000, category: WEAPON_CATEGORY, active: false, icon: 'item/hunters_aura'},
  {name: 'Intensifying Magazine', tier: 3, cost: 3000, category: WEAPON_CATEGORY, active: false, icon: 'item/intensifying_magazine'},
  {name: 'Point Blank', tier: 3, cost: 3500, category: WEAPON_CATEGORY, active: false, icon: 'item/point_blank'},
  {name: 'Pristine Emblem', tier: 3, cost: 3500, category: WEAPON_CATEGORY, active: false, icon: 'item/pristine_emblem'},
  {name: 'Sharpshooter', tier: 3, cost: 4250, category: WEAPON_CATEGORY, active: false, icon: 'item/sharpshooter'},
  {name: 'Spellslinger Headshots', tier: 3, cost: 4250, category: WEAPON_CATEGORY, active: false, icon: 'item/spellslinger_headshots'},
  {name: 'Tesla Bullets', tier: 3, cost: 3000, category: WEAPON_CATEGORY, active: false, icon: 'item/tesla_bullets'},
  {name: 'Titanic Magazine', tier: 3, cost: 3500, category: WEAPON_CATEGORY, active: false, icon: 'item/titanic_magazine'},
  {name: 'Toxic Bullets', tier: 3, cost: 3000, category: WEAPON_CATEGORY, active: false, icon: 'item/toxic_bullets'},
  {name: 'Warp Stone', tier: 3, cost: 3000, category: WEAPON_CATEGORY, active: true, icon: 'item/warp_stone'},
  {name: 'Crippling Headshot', tier: 4, cost: 6200, category: WEAPON_CATEGORY, active: false, icon: 'item/crippling_headshot'},
  {name: 'Frenzy', tier: 4, cost: 6200, category: WEAPON_CATEGORY, active: false, icon: 'item/frenzy'},
  {name: 'Glass Cannon', tier: 4, cost: 6200, category: WEAPON_CATEGORY, active: false, icon: 'item/glass_cannon'},
  {name: 'Lucky Shot', tier: 4, cost: 6200, category: WEAPON_CATEGORY, active: false, icon: 'item/lucky_shot'},
  {name: 'Ricochet', tier: 4, cost: 6200, category: WEAPON_CATEGORY, active: false, icon: 'item/ricochet'},
  {name: 'Shadow Weave', tier: 4, cost: 6200, category: WEAPON_CATEGORY, active: true, icon: 'item/shadow_weave'},
  {name: 'Silencer', tier: 4, cost: 7450, category: WEAPON_CATEGORY, active: false, icon: 'item/silencer'},
  {name: 'Spiritual Overflow', tier: 4, cost: 6200, category: WEAPON_CATEGORY, active: false, icon: 'item/spiritual_overflow'},
  {name: 'Vampiric Burst', tier: 4, cost: 6200, category: WEAPON_CATEGORY, active: true, icon: 'item/vampiric_burst'},

  {name: 'Enduring Spirit', tier: 1, cost:  500, category: VITALITY_CATEGORY, active: false, icon: 'item/enduring_spirit'},
  {name: 'Extra Health', tier: 1, cost:  500, category: VITALITY_CATEGORY, active: false, icon: 'item/extra_health'},
  {name: 'Extra Regen', tier: 1, cost:  500, category: VITALITY_CATEGORY, active: false, icon: 'item/extra_regen'},
  {name: 'Extra Stamina', tier: 1, cost:  500, category: VITALITY_CATEGORY, active: false, icon: 'item/extra_stamina'},
  {name: 'Healing Rite', tier: 1, cost:  500, category: VITALITY_CATEGORY, active: true, icon: 'item/healing_rite'},
  {name: 'Melee Lifesteal', tier: 1, cost:  500, category: VITALITY_CATEGORY, active: false, icon: 'item/melee_lifesteal'},
  {name: 'Sprint Boots', tier: 1, cost:  500, category: VITALITY_CATEGORY, active: false, icon: 'item/sprint_boots'},
  {name: 'Bullet Armor', tier: 2, cost: 1250, category: VITALITY_CATEGORY, active: false, icon: 'item/bullet_armor'},
  {name: 'Bullet Lifesteal', tier: 2, cost: 1250, category: VITALITY_CATEGORY, active: false, icon: 'item/bullet_lifesteal'},
  {name: 'Combat Barrier', tier: 2, cost: 1250, category: VITALITY_CATEGORY, active: false, icon: 'item/combat_barrier'},
  {name: 'Debuff Reducer', tier: 2, cost: 1250, category: VITALITY_CATEGORY, active: false, icon: 'item/debuff_reducer'},
  {name: 'Divine Barrier', tier: 2, cost: 1250, category: VITALITY_CATEGORY, active: true, icon: 'item/divine_barrier'},
  {name: 'Enchanter\'s Barrier', tier: 2, cost: 1250, category: VITALITY_CATEGORY, active: false, icon: 'item/enchanters_barrier'},
  {name: 'Enduring Speed', tier: 2, cost: 1750, category: VITALITY_CATEGORY, active: false, icon: 'item/enduring_speed'},
  {name: 'Healbane', tier: 2, cost: 1250, category: VITALITY_CATEGORY, active: false, icon: 'item/healbane'},
  {name: 'Healing Booster', tier: 2, cost: 1250, category: VITALITY_CATEGORY, active: false, icon: 'item/healing_booster'},
  {name: 'Healing Nova', tier: 2, cost: 1750, category: VITALITY_CATEGORY, active: true, icon: 'item/healing_nova'},
  {name: 'Reactive Barrier', tier: 2, cost: 1250, category: VITALITY_CATEGORY, active: false, icon: 'item/reactive_barrier'},
  {name: 'Restorative Locket', tier: 2, cost: 1250, category: VITALITY_CATEGORY, active: true, icon: 'item/restorative_locket'},
  {name: 'Return Fire', tier: 2, cost: 1250, category: VITALITY_CATEGORY, active: true, icon: 'item/return_fire'},
  {name: 'Spirit Armor', tier: 2, cost: 1250, category: VITALITY_CATEGORY, active: false, icon: 'item/spirit_armor'},
  {name: 'Spirit Lifesteal', tier: 2, cost: 1250, category: VITALITY_CATEGORY, active: false, icon: 'item/spirit_lifesteal'},
  {name: 'Debuff Remover', tier: 3, cost: 4250, category: VITALITY_CATEGORY, active: true, icon: 'item/debuff_remover'},
  {name: 'Fortitude', tier: 3, cost: 3500, category: VITALITY_CATEGORY, active: false, icon: 'item/fortitude'},
  {name: 'Improved Bullet Armor', tier: 3, cost: 4250, category: VITALITY_CATEGORY, active: false, icon: 'item/improved_bullet_armor'},
  {name: 'Improved Spirit Armor', tier: 3, cost: 4250, category: VITALITY_CATEGORY, active: false, icon: 'item/improved_spirit_armor'},
  {name: 'Lifestrike', tier: 3, cost: 3500, category: VITALITY_CATEGORY, active: false, icon: 'item/lifestrike'},
  {name: 'Majestic Leap', tier: 3, cost: 3000, category: VITALITY_CATEGORY, active: true, icon: 'item/majestic_leap'},
  {name: 'Metal Skin', tier: 3, cost: 3000, category: VITALITY_CATEGORY, active: true, icon: 'item/metal_skin'},
  {name: 'Rescue Beam', tier: 3, cost: 3000, category: VITALITY_CATEGORY, active: true, icon: 'item/rescue_beam'},
  {name: 'Superior Stamina', tier: 3, cost: 3500, category: VITALITY_CATEGORY, active: false, icon: 'item/superior_stamina'},
  {name: 'Veil Walker', tier: 3, cost: 3000, category: VITALITY_CATEGORY, active: false, icon: 'item/veil_walker'},
  {name: 'Colossus', tier: 4, cost: 6200, category: VITALITY_CATEGORY, active: true, icon: 'item/colossus'},
  {name: 'Inhibitor', tier: 4, cost: 6200, category: VITALITY_CATEGORY, active: false, icon: 'item/inhibitor'},
  {name: 'Leech', tier: 4, cost: 6200, category: VITALITY_CATEGORY, active: false, icon: 'item/leech'},
  {name: 'Phantom Strike', tier: 4, cost: 6200, category: VITALITY_CATEGORY, active: true, icon: 'item/phantom_strike'},
  {name: 'Siphon Bullets', tier: 4, cost: 6200, category: VITALITY_CATEGORY, active: false, icon: 'item/siphon_bullets'},
  {name: 'Unstoppable', tier: 4, cost: 6200, category: VITALITY_CATEGORY, active: true, icon: 'item/unstoppable'},

  {name: 'Ammo Scavenger', tier: 1, cost:  500, category: SPIRIT_CATEGORY, active: false, icon: 'item/ammo_scavenger'},
  {name: 'Extra Charge', tier: 1, cost:  500, category: SPIRIT_CATEGORY, active: false, icon: 'item/extra_charge'},
  {name: 'Extra Spirit', tier: 1, cost:  500, category: SPIRIT_CATEGORY, active: false, icon: 'item/extra_spirit'},
  {name: 'Infuser', tier: 1, cost:  500, category: SPIRIT_CATEGORY, active: true, icon: 'item/infuser'},
  {name: 'Mystic Burst', tier: 1, cost:  500, category: SPIRIT_CATEGORY, active: false, icon: 'item/mystic_burst'},
  {name: 'Mystic Reach', tier: 1, cost:  500, category: SPIRIT_CATEGORY, active: false, icon: 'item/mystic_reach'},
  {name: 'Spirit Strike', tier: 1, cost:  500, category: SPIRIT_CATEGORY, active: false, icon: 'item/spirit_strike'},
  {name: 'Bullet Resist Shredder', tier: 2, cost: 1250, category: SPIRIT_CATEGORY, active: false, icon: 'item/bullet_resist_shredder'},
  {name: 'Cold Front', tier: 2, cost: 1250, category: SPIRIT_CATEGORY, active: true, icon: 'item/cold_front'},
  {name: 'Decay', tier: 2, cost: 1250, category: SPIRIT_CATEGORY, active: true, icon: 'item/decay'},
  {name: 'Duration Extender', tier: 2, cost: 1250, category: SPIRIT_CATEGORY, active: false, icon: 'item/duration_extender'},
  {name: 'Improved Cooldown', tier: 2, cost: 1250, category: SPIRIT_CATEGORY, active: false, icon: 'item/improved_cooldown'},
  {name: 'Mystic Vulnerability', tier: 2, cost: 1250, category: SPIRIT_CATEGORY, active: false, icon: 'item/mystic_vulnerability'},
  {name: 'Quicksilver Reload', tier: 2, cost: 1250, category: SPIRIT_CATEGORY, active: false, icon: 'item/quicksilver_reload'},
  {name: 'Slowing Hex', tier: 2, cost: 1750, category: SPIRIT_CATEGORY, active: true, icon: 'item/slowing_hex'},
  {name: 'Suppressor', tier: 2, cost: 1250, category: SPIRIT_CATEGORY, active: false, icon: 'item/suppressor'},
  {name: 'Withering Whip', tier: 2, cost: 1250, category: SPIRIT_CATEGORY, active: true, icon: 'item/withering_whip'},
  {name: 'Arcane Surge', tier: 3, cost: 4250, category: SPIRIT_CATEGORY, active: false, icon: 'item/arcane_surge'},
  {name: 'Ethereal Shift', tier: 3, cost: 3000, category: SPIRIT_CATEGORY, active: true, icon: 'item/ethereal_shift'},
  {name: 'Improved Burst', tier: 3, cost: 3500, category: SPIRIT_CATEGORY, active: false, icon: 'item/improved_burst'},
  {name: 'Improved Reach', tier: 3, cost: 3500, category: SPIRIT_CATEGORY, active: false, icon: 'item/improved_reach'},
  {name: 'Improved Spirit', tier: 3, cost: 3500, category: SPIRIT_CATEGORY, active: false, icon: 'item/improved_spirit'},
  {name: 'Knockdown', tier: 3, cost: 3000, category: SPIRIT_CATEGORY, active: true, icon: 'item/knockdown'},
  {name: 'Mystic Slow', tier: 3, cost: 4250, category: SPIRIT_CATEGORY, active: false, icon: 'item/mystic_slow'},
  {name: 'Rapid Recharge', tier: 3, cost: 3500, category: SPIRIT_CATEGORY, active: false, icon: 'item/rapid_recharge'},
  {name: 'Silence Glyph', tier: 3, cost: 3000, category: SPIRIT_CATEGORY, active: true, icon: 'item/silence_glyph'},
  {name: 'Spirit Snatch', tier: 3, cost: 3500, category: SPIRIT_CATEGORY, active: false, icon: 'item/spirit_snatch'},
  {name: 'Superior Cooldown', tier: 3, cost: 4250, category: SPIRIT_CATEGORY, active: false, icon: 'item/superior_cooldown'},
  {name: 'Superior Duration', tier: 3, cost: 4250, category: SPIRIT_CATEGORY, active: false, icon: 'item/superior_duration'},
  {name: 'Surge of Power', tier: 3, cost: 3000, category: SPIRIT_CATEGORY, active: false, icon: 'item/surge_of_power'},
  {name: 'Torment Pulse', tier: 3, cost: 3000, category: SPIRIT_CATEGORY, active: false, icon: 'item/torment_pulse'},
  {name: 'Boundless Spirit', tier: 4, cost: 9700, category: SPIRIT_CATEGORY, active: false, icon: 'item/boundless_spirit'},
  {name: 'Curse', tier: 4, cost: 6200, category: SPIRIT_CATEGORY, active: true, icon: 'item/curse'},
  {name: 'Diviner\'s Kevlar', tier: 4, cost: 6200, category: SPIRIT_CATEGORY, active: false, icon: 'item/diviners_kevlar'},
  {name: 'Echo Shard', tier: 4, cost: 6200, category: SPIRIT_CATEGORY, active: true, icon: 'item/echo_shard'},
  {name: 'Escalating Exposure', tier: 4, cost: 7450, category: SPIRIT_CATEGORY, active: false, icon: 'item/escalating_exposure'},
  {name: 'Magic Carpet', tier: 4, cost: 6200, category: SPIRIT_CATEGORY, active: true, icon: 'item/magic_carpet'},
  {name: 'Mystic Reverb', tier: 4, cost: 6200, category: SPIRIT_CATEGORY, active: false, icon: 'item/mystic_reverb'},
  {name: 'Refresher', tier: 4, cost: 6200, category: SPIRIT_CATEGORY, active: true, icon: 'item/refresher'},
];

const itemsByName = Object.fromEntries(allItems.map((x) => [x.name, x]));

// TODO: autogenerate these
const abilityIcons = [
  'hero/pocket/barrage',
  'hero/pocket/enchanters_satchel',
  'hero/pocket/affliction',
  'hero/pocket/flying_cloak',
  'hero/kelvin/frozen_shelter',
  'hero/kelvin/ice_path',
  'hero/kelvin/frost_grenade',
  'hero/kelvin/arctic_beam',
  'hero/lady_geist/soul_exchange',
  'hero/lady_geist/life_drain',
  'hero/lady_geist/essence_bomb',
  'hero/lady_geist/malice',
  'hero/lash/ground_strike',
  'hero/lash/death_slam',
  'hero/lash/grapple',
  'hero/lash/flog',
  'hero/abrams/siphon_life',
  'hero/abrams/shoulder_charge',
  'hero/abrams/seismic_impact',
  'hero/abrams/infernal_resilience',
  'hero/yamato/shadow_transformation',
  'hero/yamato/power_slash',
  'hero/yamato/flying_strike',
  'hero/yamato/crimson_slash',
  'hero/infernus/concussive_combustion',
  'hero/infernus/afterburn',
  'hero/infernus/catalyst',
  'hero/infernus/flame_dash',
  'hero/ivy/air_drop',
  'hero/ivy/stone_form',
  'hero/ivy/kudzu_bomb',
  'hero/ivy/watchers_covenant',
  'hero/viscous/splatter',
  'hero/viscous/puddle_punch',
  'hero/viscous/goo_ball',
  'hero/viscous/the_cube',
  'hero/vindicta/assassinate',
  'hero/vindicta/flight',
  'hero/vindicta/crow_familiar',
  'hero/vindicta/stake',
  'hero/dynamo/rejuvenating_aura',
  'hero/dynamo/kinetic_pulse',
  'hero/dynamo/quantum_entanglement',
  'hero/dynamo/singularity',
  'hero/mirage/traveler',
  'hero/mirage/tornado',
  'hero/mirage/djinns_mark',
  'hero/mirage/fire_scarabs',
  'hero/mcginnis/spectral_wall',
  'hero/mcginnis/mini_turret',
  'hero/mcginnis/medicinal_specter',
  'hero/mcginnis/heavy_barrage',
  'hero/grey_talon/immobilizing_trap',
  'hero/grey_talon/charged_shot',
  'hero/grey_talon/rain_of_arrows',
  'hero/grey_talon/guided_owl',
  'hero/bebop/hyper_beam',
  'hero/bebop/sticky_bomb',
  'hero/bebop/hook',
  'hero/bebop/exploding_uppercut',
  'hero/seven/power_surge',
  'hero/seven/lightning_ball',
  'hero/seven/static_charge',
  'hero/seven/storm_cloud',
  'hero/haze/bullet_dance',
  'hero/haze/fixation',
  'hero/haze/sleep_dagger',
  'hero/haze/smoke_bomb',
  'hero/paradox/pulse_grenade',
  'hero/paradox/time_wall',
  'hero/paradox/paradoxical_swap',
  'hero/paradox/kinetic_carbine',
  'hero/wraith/card_trick',
  'hero/wraith/telekinesis',
  'hero/wraith/project_mind',
  'hero/wraith/full_auto',
  'hero/shiv/bloodletting',
  'hero/shiv/serrated_knives',
  'hero/shiv/killing_blow',
  'hero/shiv/slice_and_dice',
  'hero/mo_and_krill/sand_blast',
  'hero/mo_and_krill/combo',
  'hero/mo_and_krill/scorn',
  'hero/mo_and_krill/burrow',
  'hero/warden/willpower',
  'hero/warden/alchemical_flask',
  'hero/warden/last_stand',
  'hero/warden/binding_word',
];

const groupedStatIcons = [
  [
    'stat/cooldown',
    'stat/charge',
    'stat/charge_cooldown',
    'stat/duration',
    'stat/range',
    'stat/aoe',
  ], [
    'stat/weapon_damage',
    'stat/spirit_damage',
    'stat/melee',
    'stat/bullet',
    'stat/fire_rate',
    'stat/ammo',
    'stat/reload',
  ], [
    'stat/bullet_armor',
    'stat/bullet_resist_reduction',
    'stat/spirit_armor',
    'stat/spirit_resist_reduction',
    'stat/bullet_shield',
    'stat/spirit_shield',
  ], [
    'stat/move_speed',
    'stat/stamina',
    'stat/move_slow',
    'stat/move_debuff',
    'stat/stun',
    'stat/invisible',
  ], [
    'stat/health',
    'stat/healing',
    'stat/damage_amplification',
  ], [
    'stat/placeholder',
    'stat/ability_point',
    'stat/silence',
  ],
];

const statIcons = groupedStatIcons.flat();

const tierCosts = [0, 500, 1250, 3000, 6200];

const placeholderMarkdownSection = {type: 'markdown', data: 'Insert **markdown** here.'};

const placeholderGridSection = {
  type: 'grid',
  data: {
    cells:  [{icon: {image: 'stat/placeholder'}, value: 0, signed: false, stat: 'stat'}],
    values: [{value: 0, units: 'm', stat: 'stat'}],
  },
};

const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

export {
  abilityIcons,
  allItems,
  deepCopy,
  groupedStatIcons,
  isFirefox,
  itemsByName,
  placeholderGridSection,
  placeholderMarkdownSection,
  statIcons,
  tierCosts,
  useAction,
};
