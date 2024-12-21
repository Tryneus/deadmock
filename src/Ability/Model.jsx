import {makeAutoObservable} from 'mobx';

import {deepCopy} from '/src/Common';
import {DetailsModel} from '/src/Details/Model';
import {GridModel} from '/src/Grid/Model';
import {serializeable} from '/src/Serialize';
import {ValueModel} from '/src/Value/Model';

class AbilityModel {
  id;
  category = 'ability';
  name = '';
  stats = [];
  upgrades = ['', '', ''];
  details = null;

  constructor(raw) {
    this.id = raw?.id || crypto.randomUUID();
    this.category = raw?.category || this.category;
    this.name = raw?.name || this.name;
    this.stats = raw?.stats?.map((x) => new ValueModel(x)) || this.stats;
    this.upgrades = deepCopy(raw?.upgrades || this.upgrades);
    this.details = new DetailsModel(raw?.details);
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

serializeable(AbilityModel, {
  v1: [
    ['category'],
    ['name'],
    ['stats', [ValueModel]],
    ['description'],
    ['sections', [GridModel]],
    ['upgrades'],
  ],
  v2: [
    ['category'],
    ['name'],
    ['stats', [ValueModel]],
    ['details', DetailsModel],
    ['upgrades'],
  ],
});

export {AbilityModel};
