import {makeAutoObservable} from 'mobx';

import {GridModel} from '../Grid';
import {ValueModel} from '../Value';

class AbilityModel {
  id;
  category = 'ability';
  name = '';
  stats = [];
  description = '';
  grid;
  upgrades = ['', '', ''];

  constructor(raw) {
    this.id = raw.id ?? crypto.randomUUID();
    if (raw) {
      this.name = raw.name;
      if (raw.stats) {
        this.stats = raw.stats.map((x) => new ValueModel(x));
      }
      this.description = raw.description;
      this.grid = new GridModel(raw.grid);
      this.upgrades = raw.upgrades || this.upgrades;
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
