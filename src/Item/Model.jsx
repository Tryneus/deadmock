import {makeAutoObservable} from 'mobx';

import {deepCopy, isString, itemsByName, placeholderGrid, placeholderMarkdown, tierCosts} from '../Common';
import {GridModel} from '../Grid';
import {serializeable} from '../Serialize';
import {ValueModel} from '../Value';

class ItemEffectModel {
  active = false;
  cooldown = 0;
  description = placeholderMarkdown;
  sections = [];

  constructor(raw) {
    this.active = Boolean(raw?.active);
    this.cooldown = raw?.cooldown || this.cooldown;
    this.description = raw?.description || this.description;
    this.sections = raw?.sections?.map((x) => (isString(x) ? x : new GridModel(x))) || this.sections;
    makeAutoObservable(this);
  }

  addMarkdownSection() {
    this.sections.push(placeholderMarkdown);
  }

  addGridSection() {
    this.sections.push(new GridModel(placeholderGrid));
  }

  removeSection(i) {
    this.sections.splice(i, 1);
  }
}

serializeable(ItemEffectModel, [
  ['description'],
  ['sections', [GridModel]],
  ['active'],
  ['cooldown'],
]);

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
    this.category = raw?.category || this.category;
    this.name = raw?.name || this.name;
    this.tier = raw?.tier || this.tier;
    this.components = deepCopy(raw?.components || this.components);
    this.stats = raw?.stats?.map((x) => new ValueModel(x)) || this.stats;
    this.effects = raw?.effects?.map((x) => new ItemEffectModel(x)) || this.effects;
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
    this.effects.push(new ItemEffectModel({
      active:   false,
      cooldown: 6,
      sections: [placeholderGrid],
      ...raw,
    }));
  }

  removeEffect(i) {
    this.effects.splice(i, 1);
  }
}

serializeable(ItemModel, [
  ['category'],
  ['name'],
  ['tier'],
  ['components'],
  ['stats', [ValueModel]],
  ['effects', [ItemEffectModel]],
]);

export {ItemModel};
