import {makeAutoObservable} from 'mobx';

import {GridModel} from '../Grid';
import {ValueModel} from '../Value';

class AbilityUpgrade {
  description = '';

  constructor(raw) {
    this.description = raw;
    makeAutoObservable(this);
  }
}

class AbilityModel {
  name = '';
  stats = [];
  description = '';
  grid;
  upgrades = [];

  constructor(raw) {
    this.upgrades = ['', '', ''].map((x) => new AbilityUpgrade(x));
    if (raw) {
      this.name = raw.name;
      if (raw.stats) {
        this.stats = raw.stats.map((x) => new ValueModel(x));
      }
      this.description = raw.description;
      this.grid = new GridModel(raw.grid);
      if (raw.upgrades) {
        this.upgrades = raw.upgrades.map((x) => new AbilityUpgrade(x));
      }
    } else {
      this.grid = new GridModel();
    }
    makeAutoObservable(this);
  }

  addStat(raw) {
    this.stats.push(new ValueModel(raw));
  }

  removeStat(i) {
    this.stats.splice(i, 1);
  }
}

export {AbilityModel};
