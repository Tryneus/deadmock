import {makeAutoObservable} from 'mobx';

import {deepCopy, itemsByName, tierCosts} from '/src/Common';
import {DetailsModel, defaultGridSection} from '/src/Details/Model';
import {GridModel} from '/src/Grid/Model';
import {serializeable} from '/src/Serialize/serialization';
import {ValueModel} from '/src/Value/Model';

const defaultEffect = {
  active:   false,
  cooldown: 6,
  details:  {
    sections: [defaultGridSection],
  },
};

class ItemEffectModel {
  id; // only used for rendering purposes as a react `key`, not persisted
  active = false;
  cooldown = 0;
  details = null;

  constructor(raw) {
    this.id = crypto.randomUUID();
    this.active = Boolean(raw?.active);
    this.cooldown = raw?.cooldown || this.cooldown;
    this.details = new DetailsModel(raw?.details);
    makeAutoObservable(this);
  }
}

serializeable(ItemEffectModel, {
  v1: [
    ['description'],
    ['sections', [GridModel]],
    ['active'],
    ['cooldown'],
  ],
  v2: [
    ['details', DetailsModel],
    ['active'],
    ['cooldown'],
  ],
});

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

  removeStat(stat) {
    const index = this.stats.indexOf(stat);
    if (index !== -1) {
      this.stats.splice(index, 1);
    }
  }

  addEffect(raw) {
    this.effects.push(new ItemEffectModel({
      ...deepCopy(defaultEffect),
      ...raw,
    }));
  }

  removeEffect(effect) {
    const index = this.effects.indexOf(effect);
    if (index !== -1) {
      this.effects.splice(index, 1);
    }
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
