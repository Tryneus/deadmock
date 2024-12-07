import {makeAutoObservable} from 'mobx';

import {deepCopy, itemsByName, placeholderGridSection, placeholderMarkdownSection, tierCosts} from '../Common';
import {GridModel} from '../Grid';
import {ValueModel} from '../Value';

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
          this.data = new GridModel(raw.data);
        }
      }
    }
    makeAutoObservable(this);
  }
}

class ItemEffect {
  active = false;
  cooldown = 0;
  description = placeholderMarkdownSection.data;
  sections = [];

  constructor(raw) {
    if (raw) {
      this.active = raw.active;
      this.cooldown = raw.cooldown;
      this.description = raw.description || this.description;
      this.sections = raw.sections.map((x) => new ItemEffectSection(x));
    }
    makeAutoObservable(this);
  }

  addMarkdownSection() {
    this.sections.push(new ItemEffectSection(placeholderMarkdownSection));
  }

  addGridSection() {
    this.sections.push(new ItemEffectSection(placeholderGridSection));
  }

  removeSection(i) {
    this.sections.splice(i, 1);
  }
}

class ItemModel {
  id;
  category = 'weapon';
  name = '';
  tier = 1;
  components = [];
  stats = [];
  effects = [];

  constructor(raw) {
    this.id = raw && raw.id || crypto.randomUUID();
    if (raw) {
      this.category = raw.category;
      this.name = raw.name;
      this.tier = raw.tier;
      if (raw.components) {
        this.components = deepCopy(raw.components);
      }
      if (raw.stats) {
        this.stats = raw.stats.map((x) => new ValueModel(x));
      }
      if (raw.effects) {
        this.effects = raw.effects.map((x) => new ItemEffect(x));
      }
    }

    makeAutoObservable(this);
  }

  get cost() {
    return tierCosts[this.tier] + this.components.reduce((acc, name) => acc + itemsByName[name]?.cost, 0);
  }

  get componentInfo() {
    return this.components.map((name) => itemsByName[name]);
  }

  addComponent(name) {
    this.components.push(name || 'Extra Health');
  }

  removeComponent(i) {
    this.components.splice(i, 1);
  }

  addStat(raw) {
    this.stats.push(new ValueModel({signed: true, ...raw}));
  }

  removeStat(i) {
    this.stats.splice(i, 1);
  }

  addEffect(raw) {
    this.effects.push(new ItemEffect({
      active:   false,
      cooldown: 6,
      sections: [placeholderGridSection],
      ...raw,
    }));
  }

  removeEffect(i) {
    this.effects.splice(i, 1);
  }
}

export {ItemModel};
