import {makeAutoObservable} from 'mobx';

import {serializeable} from '/src/Serialize/serialization';
import {ValueModel} from '/src/Value/Model';

class ForeignAbilityModel {
  id = '';
  image = '';

  constructor(raw) {
    this.id = raw?.id || this.id;
    this.image = raw?.image || this.image;
    makeAutoObservable(this);
  }
}

serializeable(ForeignAbilityModel, [
  ['id'],
  ['image'],
]);

class HeroStatGroupModel {
  label = '';
  color = '';
  stats = [];

  constructor(raw) {
    this.label = raw?.label || this.label;
    this.color = raw?.color || this.color;
    this.stats = raw?.stats?.map((x) => new ValueModel(x)) || this.stats;
    makeAutoObservable(this);
  }
}

serializeable(HeroStatGroupModel, [
  ['label'],
  ['color'],
  ['stats', [ValueModel]],
]);

class HeroModel {
  id;
  category = 'hero';
  name = '';
  tagline = '';
  description = '';
  portrait = '';
  statGroups = [];
  abilities = [];

  constructor(raw) {
    this.id = raw?.id || crypto.randomUUID();
    this.name = raw?.name || this.name;
    this.tagline = raw?.tagline || this.tagline;
    this.description = raw?.description || this.description;
    this.portrait = raw?.portrait || this.portrait;
    this.statGroups = raw?.statGroups?.map((x) => new HeroStatGroupModel(x)) || this.statGroups;
    this.abilities = raw?.abilities?.map((x) => new ForeignAbilityModel(x)) || this.abilities;
    makeAutoObservable(this);
  }

  addStat(raw) {
    this.stats.push(new ValueModel(raw));
  }

  removeStat(stat) {
    const index = this.stats.indexOf(stat);
    if (index !== -1) {
      this.stats.splice(index, 1);
    }
  }
}

serializeable(HeroModel, [
  ['category'],
  ['name'],
  ['tagline'],
  ['description'],
  ['portrait'],
  ['statGroups', [HeroStatGroupModel]],
  ['abilities', [ForeignAbilityModel]],
]);

export {HeroModel};
