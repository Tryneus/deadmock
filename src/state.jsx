import {makeAutoObservable, action, computed} from 'mobx';


const deepCopy = (x) => JSON.parse(JSON.stringify(x));

const clampInteger = (val, min = 0, max = Infinity) => min(max(0, Math.floor(val)), max);
const clampNumber = (val, min = 0, max = Infinity) => min(max(0, val), max);

const WEAPON_CATEGORY = 'weapon';
const VITALITY_CATEGORY = 'vitality';
const SPIRIT_CATEGORY = 'spirit';

const ItemCategories = new Set([WEAPON_CATEGORY, VITALITY_CATEGORY, SPIRIT_CATEGORY]);

const items = {
  'Basic Magazine':         {cost:  500, category: WEAPON_CATEGORY, icon: 'item/basic_magazine'},
  'Close Quarters':         {cost:  500, category: WEAPON_CATEGORY, icon: 'item/close_quarters'},
  'Headshot Booster':       {cost:  500, category: WEAPON_CATEGORY, icon: 'item/headshot_booster'},
  'High-Velocity Mag':      {cost:  500, category: WEAPON_CATEGORY, icon: 'item/high_velocity_mag'},
  'Hollow Point Ward':      {cost:  500, category: WEAPON_CATEGORY, icon: 'item/hollow_point_ward'},
  'Monster Rounds':         {cost:  500, category: WEAPON_CATEGORY, icon: 'item/monster_rounds'},
  'Rapid Rounds':           {cost:  500, category: WEAPON_CATEGORY, icon: 'item/rapid_rounds'},
  'Restorative Shot':       {cost:  500, category: WEAPON_CATEGORY, icon: 'item/restorative_shot'},
  'Active Reload':          {cost: 1250, category: WEAPON_CATEGORY, icon: 'item/active_reload'},
  'Berserker':              {cost: 1250, category: WEAPON_CATEGORY, icon: 'item/berserker'},
  'Fleetfoot':              {cost: 1250, category: WEAPON_CATEGORY, icon: 'item/fleetfoot'},
  'Kinetic Dash':           {cost: 1250, category: WEAPON_CATEGORY, icon: 'item/kinetic_dash'},
  'Long Range':             {cost: 1250, category: WEAPON_CATEGORY, icon: 'item/long_range'},
  'Melee Charge':           {cost: 1250, category: WEAPON_CATEGORY, icon: 'item/melee_charge'},
  'Mystic Shot':            {cost: 1250, category: WEAPON_CATEGORY, icon: 'item/mystic_shot'},
  'Slowing Bullets':        {cost: 1250, category: WEAPON_CATEGORY, icon: 'item/slowing_bullets'},
  'Soul Shredder Bullets':  {cost: 1250, category: WEAPON_CATEGORY, icon: 'item/soul_shredder_bullets'},
  'Swift Striker':          {cost: 1250, category: WEAPON_CATEGORY, icon: 'item/swift_striker'},
  'Alchemical Fire':        {cost: 3000, category: WEAPON_CATEGORY, icon: 'item/alchemical_fire'},
  'Burst Fire':             {cost: 3000, category: WEAPON_CATEGORY, icon: 'item/burst_fire'},
  'Escalating Resilience':  {cost: 3000, category: WEAPON_CATEGORY, icon: 'item/escalating_resilience'},
  'Headhunter':             {cost: 3500, category: WEAPON_CATEGORY, icon: 'item/headhunter'},
  'Heroic Aura':            {cost: 3000, category: WEAPON_CATEGORY, icon: 'item/heroic_aura'},
  'Hunter\'s Aura':         {cost: 3000, category: WEAPON_CATEGORY, icon: 'item/hunters_aura'},
  'Intensifying Magazine':  {cost: 3000, category: WEAPON_CATEGORY, icon: 'item/intensifying_magazine'},
  'Point Blank':            {cost: 3500, category: WEAPON_CATEGORY, icon: 'item/point_blank'},
  'Pristine Emblem':        {cost: 3500, category: WEAPON_CATEGORY, icon: 'item/pristine_emblem'},
  'Sharpshooter':           {cost: 4250, category: WEAPON_CATEGORY, icon: 'item/sharpshooter'},
  'Tesla Bullets':          {cost: 3000, category: WEAPON_CATEGORY, icon: 'item/tesla_bullets'},
  'Titanic Magazine':       {cost: 3500, category: WEAPON_CATEGORY, icon: 'item/titanic_magazine'},
  'Toxic Bullets':          {cost: 3000, category: WEAPON_CATEGORY, icon: 'item/toxic_bullets'},
  'Warp Stone':             {cost: 3000, category: WEAPON_CATEGORY, icon: 'item/warp_stone'},
  'Crippling Headshot':     {cost: 6200, category: WEAPON_CATEGORY, icon: 'item/crippling_headshot'},
  'Frenzy':                 {cost: 6200, category: WEAPON_CATEGORY, icon: 'item/frenzy'},
  'Glass Cannon':           {cost: 6200, category: WEAPON_CATEGORY, icon: 'item/glass_cannon'},
  'Lucky Shot':             {cost: 6200, category: WEAPON_CATEGORY, icon: 'item/lucky_shot'},
  'Ricochet':               {cost: 6200, category: WEAPON_CATEGORY, icon: 'item/ricochet'},
  'Shadow Weave':           {cost: 6200, category: WEAPON_CATEGORY, icon: 'item/shadow_weave'},
  'Silencer':               {cost: 7450, category: WEAPON_CATEGORY, icon: 'item/silencer'},
  'Spiritual Overflow':     {cost: 6200, category: WEAPON_CATEGORY, icon: 'item/spiritual_overflow'},
  'Vampiric Burst':         {cost: 6200, category: WEAPON_CATEGORY, icon: 'item/vampiric_burst'},

  'Enduring Spirit':        {cost:  500, category: VITALITY_CATEGORY, icon: 'item/enduring_spirit'},
  'Extra Health':           {cost:  500, category: VITALITY_CATEGORY, icon: 'item/extra_health'},
  'Extra Regen':            {cost:  500, category: VITALITY_CATEGORY, icon: 'item/extra_regen'},
  'Extra Stamina':          {cost:  500, category: VITALITY_CATEGORY, icon: 'item/extra_stamina'},
  'Healing Rite':           {cost:  500, category: VITALITY_CATEGORY, icon: 'item/healing_rite'},
  'Melee Lifesteal':        {cost:  500, category: VITALITY_CATEGORY, icon: 'item/melee_lifesteal'},
  'Sprint Boots':           {cost:  500, category: VITALITY_CATEGORY, icon: 'item/sprint_boots'},
  'Bullet Armor':           {cost: 1250, category: VITALITY_CATEGORY, icon: 'item/bullet_armor'},
  'Bullet Lifesteal':       {cost: 1250, category: VITALITY_CATEGORY, icon: 'item/bullet_lifesteal'},
  'Combat Barrier':         {cost: 1250, category: VITALITY_CATEGORY, icon: 'item/combat_barrier'},
  'Debuff Reducer':         {cost: 1250, category: VITALITY_CATEGORY, icon: 'item/debuff_reducer'},
  'Divine Barrier':         {cost: 1250, category: VITALITY_CATEGORY, icon: 'item/divine_barrier'},
  'Enchanter\'s Barrier':   {cost: 1250, category: VITALITY_CATEGORY, icon: 'item/enchanters_barrier'},
  'Enduring Speed':         {cost: 1750, category: VITALITY_CATEGORY, icon: 'item/enduring_speed'},
  'Healbane':               {cost: 1250, category: VITALITY_CATEGORY, icon: 'item/healbane'},
  'Healing Booster':        {cost: 1250, category: VITALITY_CATEGORY, icon: 'item/healing_booster'},
  'Healing Nova':           {cost: 1750, category: VITALITY_CATEGORY, icon: 'item/healing_nova'},
  'Reactive Barrier':       {cost: 1250, category: VITALITY_CATEGORY, icon: 'item/reactive_barrier'},
  'Restorative Locket':     {cost: 1250, category: VITALITY_CATEGORY, icon: 'item/restorative_locket'},
  'Return Fire':            {cost: 1250, category: VITALITY_CATEGORY, icon: 'item/return_fire'},
  'Spirit Armor':           {cost: 1250, category: VITALITY_CATEGORY, icon: 'item/spirit_armor'},
  'Spirit Lifesteal':       {cost: 1250, category: VITALITY_CATEGORY, icon: 'item/spirit_lifesteal'},
  'Debuff Remover':         {cost: 4250, category: VITALITY_CATEGORY, icon: 'item/debuff_remover'},
  'Fortitude':              {cost: 3500, category: VITALITY_CATEGORY, icon: 'item/fortitude'},
  'Improved Bullet Armor':  {cost: 4250, category: VITALITY_CATEGORY, icon: 'item/improved_bullet_armor'},
  'Improved Spirit Armor':  {cost: 4250, category: VITALITY_CATEGORY, icon: 'item/improved_spirit_armor'},
  'Lifestrike':             {cost: 3500, category: VITALITY_CATEGORY, icon: 'item/lifestrike'},
  'Majestic Leap':          {cost: 3000, category: VITALITY_CATEGORY, icon: 'item/majestic_leap'},
  'Metal Skin':             {cost: 3000, category: VITALITY_CATEGORY, icon: 'item/metal_skin'},
  'Rescue Beam':            {cost: 3000, category: VITALITY_CATEGORY, icon: 'item/rescue_beam'},
  'Superior Stamina':       {cost: 3500, category: VITALITY_CATEGORY, icon: 'item/superior_stamina'},
  'Veil Walker':            {cost: 3000, category: VITALITY_CATEGORY, icon: 'item/veil_walker'},
  'Colossus':               {cost: 6200, category: VITALITY_CATEGORY, icon: 'item/colossus'},
  'Inhibitor':              {cost: 6200, category: VITALITY_CATEGORY, icon: 'item/inhibitor'},
  'Leech':                  {cost: 6200, category: VITALITY_CATEGORY, icon: 'item/leech'},
  'Phantom Strike':         {cost: 6200, category: VITALITY_CATEGORY, icon: 'item/phantom_strike'},
  'Siphon Bullets':         {cost: 6200, category: VITALITY_CATEGORY, icon: 'item/siphon_bullets'},
  'Unstoppable':            {cost: 6200, category: VITALITY_CATEGORY, icon: 'item/unstoppable'},

  'Ammo Scavenger':         {cost:  500, category: SPIRIT_CATEGORY, icon: 'item/ammo_scavenger'},
  'Extra Charge':           {cost:  500, category: SPIRIT_CATEGORY, icon: 'item/extra_charge'},
  'Extra Spirit':           {cost:  500, category: SPIRIT_CATEGORY, icon: 'item/extra_spirit'},
  'Infuser':                {cost:  500, category: SPIRIT_CATEGORY, icon: 'item/infuser'},
  'Mystic Burst':           {cost:  500, category: SPIRIT_CATEGORY, icon: 'item/mystic_burst'},
  'Mystic Reach':           {cost:  500, category: SPIRIT_CATEGORY, icon: 'item/mystic_reach'},
  'Spirit Strike':          {cost:  500, category: SPIRIT_CATEGORY, icon: 'item/spirit_strike'},
  'Bullet Resist Shredder': {cost: 1250, category: SPIRIT_CATEGORY, icon: 'item/bullet_resist_shredder'},
  'Cold Front':             {cost: 1250, category: SPIRIT_CATEGORY, icon: 'item/cold_front'},
  'Decay':                  {cost: 1250, category: SPIRIT_CATEGORY, icon: 'item/decay'},
  'Duration Extender':      {cost: 1250, category: SPIRIT_CATEGORY, icon: 'item/duration_extender'},
  'Improved Cooldown':      {cost: 1250, category: SPIRIT_CATEGORY, icon: 'item/improved_cooldown'},
  'Mystic Vulnerability':   {cost: 1250, category: SPIRIT_CATEGORY, icon: 'item/mystic_vulnerability'},
  'Quicksilver Reload':     {cost: 1250, category: SPIRIT_CATEGORY, icon: 'item/quicksilver_reload'},
  'Slowing Hex':            {cost: 1750, category: SPIRIT_CATEGORY, icon: 'item/slowing_hex'},
  'Suppressor':             {cost: 1250, category: SPIRIT_CATEGORY, icon: 'item/suppressor'},
  'Withering Whip':         {cost: 1250, category: SPIRIT_CATEGORY, icon: 'item/withering_whip'},
  'Ethereal Shift':         {cost: 3000, category: SPIRIT_CATEGORY, icon: 'item/ethereal_shift'},
  'Improved Burst':         {cost: 3500, category: SPIRIT_CATEGORY, icon: 'item/improved_burst'},
  'Improved Reach':         {cost: 3500, category: SPIRIT_CATEGORY, icon: 'item/improved_reach'},
  'Improved Spirit':        {cost: 3500, category: SPIRIT_CATEGORY, icon: 'item/improved_spirit'},
  'Knockdown':              {cost: 3000, category: SPIRIT_CATEGORY, icon: 'item/knockdown'},
  'Mystic Slow':            {cost: 4250, category: SPIRIT_CATEGORY, icon: 'item/mystic_slow'},
  'Rapid Recharge':         {cost: 3500, category: SPIRIT_CATEGORY, icon: 'item/rapid_recharge'},
  'Silence Glyph':          {cost: 3000, category: SPIRIT_CATEGORY, icon: 'item/silence_glyph'},
  'Superior Cooldown':      {cost: 4250, category: SPIRIT_CATEGORY, icon: 'item/superior_cooldown'},
  'Superior Duration':      {cost: 4250, category: SPIRIT_CATEGORY, icon: 'item/superior_duration'},
  'Surge of Power':         {cost: 3000, category: SPIRIT_CATEGORY, icon: 'item/surge_of_power'},
  'Torment Pulse':          {cost: 3000, category: SPIRIT_CATEGORY, icon: 'item/torment_pulse'},
  'Boundless Spirit':       {cost: 9700, category: SPIRIT_CATEGORY, icon: 'item/boundless_spirit'},
  'Curse':                  {cost: 6200, category: SPIRIT_CATEGORY, icon: 'item/curse'},
  'Diviner\'s Kevlar':      {cost: 6200, category: SPIRIT_CATEGORY, icon: 'item/diviners_kevlar'},
  'Echo Shard':             {cost: 6200, category: SPIRIT_CATEGORY, icon: 'item/echo_shard'},
  'Escalating Exposure':    {cost: 7450, category: SPIRIT_CATEGORY, icon: 'item/escalating_exposure'},
  'Magic Carpet':           {cost: 6200, category: SPIRIT_CATEGORY, icon: 'item/magic_carpet'},
  'Mystic Reverb':          {cost: 6200, category: SPIRIT_CATEGORY, icon: 'item/mystic_reverb'},
  'Refresher':              {cost: 6200, category: SPIRIT_CATEGORY, icon: 'item/refresher'},
};

const tierCosts = [0, 500, 1250, 3000, 6200];

class Icon {
  image = 'placeholder';
  color = 'grey';

  constructor(raw) {
    if (raw && raw.image) {
      this.image = raw.image;
    }
    if (raw && raw.color) {
      this.color = raw.color;
    }
    makeAutoObservable(this);
  }
}

class Value {
  value = 0;
  signed = true;
  units = 'm';
  stat = 'stat';
  icon;
  color = null;
  conditional = false;
  spiritScaling = null;

  constructor(raw) {
    if (raw) {
      this.value = raw.value;
      this.signed = raw.signed;
      this.units = raw.units;
      this.stat = raw.stat;
      this.icon = new Icon(raw.icon);
      this.color = raw.color;
      this.conditional = raw.conditional;
      if (raw.spiritScaling) {
        this.spiritScaling = raw.spiritScaling;
      }
    } else {
      this.Icon = new Icon()
    }
    makeAutoObservable(this);
  }

  set value(x) {
    this.value = x;
  }

  set signed(x) {
    this.signed = x;
  }

  set units(x) {
    this.units = x;
  }

  set stat(x) {
    this.stat = x;
  }

  set conditional(x) {
    this.conditional = x;
  }

  set color(x) {
    this.color = x;
  }
}

class GridData {
  cells = []
  values = []

  constructor(raw) {
    if (raw) {
      if (raw.cells) {
        this.cells = raw.cells.map((x) => new Value(x));
      }
      if (raw.values) {
        this.values = raw.values.map((x) => new Value(x));
      }
    }
    makeAutoObservable(this);
  }

  addCell() {
    this.cells.push(new Value());
  }

  removeCell(i) {
    this.cells.splice(i, 1);
  }

  addValue() {
    this.values.push(new Value());
  }

  removeValue(i) {
    this.values.splice(i, 1);
  }
}

class ItemEffectSection {
  type = '';
  data = null;

  constructor(raw) {
    if (raw) {
      this.type = raw.type;
      if (raw.data) {
        if (this.type === 'markdown') {
          this.data = raw.data;
        }
        if (this.type === 'grid') {
          this.data = new GridData(raw.data);
        }
      }
    }
    makeAutoObservable(this);
  }
}

class ItemEffect {
  type = 'passive'
  cooldown = 0
  sections = []

  constructor(raw) {
    if (raw) {
      this.type = raw.type;
      this.cooldown = raw.cooldown;
      this.sections = raw.sections.map((x) => new ItemEffectSection(x));
    }
    makeAutoObservable(this);
  }

  set type(t) {
    if (['passive', 'active'].contains(t)) {
      this.type = t;
    }
  }

  addMarkdownSection(t) {
    this.sections.push(new ItemEffectSection({type: 'markdown'}));
  }

  addGridSection(t) {
    this.sections.push(new ItemEffectSection({type: 'grid'}));
  }

  removeSection(i) {
    this.sections.splice(i, 1);
  }
}

class ItemState {
  category = 'weapon'
  name = ''
  tier = 1
  components = []
  stats = []
  effects = []

  constructor(raw) {
    if (raw) {
      this.category = raw.category;
      this.name = raw.name;
      this.tier = raw.tier;
      this.components = deepCopy(raw.components);
      this.stats = raw.stats.map((x) => new Value(x));
      this.effects = raw.effects.map((x) => new ItemEffect(x));
    }

    makeAutoObservable(this);
  }

  get cost() {
    return tierCosts[this.tier] + this.components.map((name) => items[name].cost);
  }

  set category(s) {
    if (categories.has(s)) {
      this.category = s;
    }
  }

  set tier(num) {
    this.tier = clampInteger(num, 1, 4);
  }

  addComponent() {
    this.components.push('Extra Health');
  }

  removeComponent(i) {
    this.components.splice(i, 1);
  }

  addStat() {
    this.stats.push(new Value());
  }

  removeStat(i) {
    this.stats.splice(i, 1);
  }

  addEffect() {
    this.effects.push(new ItemEffect());
  }

  removeEffect(i) {
    this.effects.splice(i, 1);
  }
}

class AbilityUpgrade {
  description = '';
  constructor (raw) {
    this.description = raw;
    makeAutoObservable(this);
  }

  set description(x) {
    this.description = x;
  }
}

class AbilityState {
  name = '';
  headerStats = [];
  description = '';
  grid;
  upgrades = [];

  constructor(raw) {
    this.upgrades = ['', '', ''].map((x) => new AbilityUpgrade(x));
    if (raw) {
      this.name = raw.name;
      if (raw.headerStats) {
        this.headerStats = raw.headerStats.map((x) => new Value(x));
      }
      this.description = raw.description;
      this.grid = new GridData(raw.grid);
      if (raw.upgrades) {
        this.upgrades = raw.upgrades.map((x) => new AbilityUpgrade(x));
      }
    } else {
      this.grid = new GridData();
    }
    makeAutoObservable(this);
  }

  addStat() {
    this.stats.push(new Value());
  }

  removeStat(i) {
    this.stats.splice(i, 1);
  }
}

export {ItemState, AbilityState};
