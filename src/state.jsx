import {makeAutoObservable} from 'mobx';
import {deepCopy, items, tierCosts} from './common';

class Icon {
  image = 'stat/placeholder';
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
      this.Icon = new Icon();
    }
    makeAutoObservable(this);
  }
}

class GridData {
  cells = [];
  values = [];

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
  active = false;
  cooldown = 0;
  sections = [];

  constructor(raw) {
    if (raw) {
      this.active = raw.active;
      this.cooldown = raw.cooldown;
      this.sections = raw.sections.map((x) => new ItemEffectSection(x));
    }
    makeAutoObservable(this);
  }

  addMarkdownSection() {
    this.sections.push(new ItemEffectSection({type: 'markdown'}));
  }

  addGridSection() {
    this.sections.push(new ItemEffectSection({type: 'grid'}));
  }

  removeSection(i) {
    this.sections.splice(i, 1);
  }
}

class ItemState {
  category = 'weapon';
  name = '';
  tier = 1;
  components = [];
  stats = [];
  effects = [];

  constructor(raw) {
    if (raw) {
      this.category = raw.category;
      this.name = raw.name;
      this.tier = raw.tier;
      if (raw.components) {
        this.components = deepCopy(raw.components);
      }
      if (raw.stats) {
        this.stats = raw.stats.map((x) => new Value(x));
      }
      if (raw.effects) {
        this.effects = raw.effects.map((x) => new ItemEffect(x));
      }
    }

    makeAutoObservable(this);
  }

  get cost() {
    return tierCosts[this.tier] + this.components.reduce((acc, name) => acc + items[name]?.cost, 0);
  }

  get componentInfo() {
    return this.components.map((name) => ({name, ...items[name]}));
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
    this.effects.push(new ItemEffect({
      active: false,
      cooldown: 6,
      sections: [
        {type: 'markdown', data: 'Insert **markdown** here.'},
        {
          type: 'grid',
          data: {
            cells: [{icon: {image: 'stat/placeholder'}, value: 0, signed: false, stat: 'stat'}],
            values: [{value: 0, units: 'm', stat: 'stat'}],
          },
        },
      ],
    }));
  }

  removeEffect(i) {
    this.effects.splice(i, 1);
  }
}

class AbilityUpgrade {
  description = '';

  constructor(raw) {
    this.description = raw;
    makeAutoObservable(this);
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

export {AbilityState, ItemState};
