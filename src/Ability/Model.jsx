import {makeAutoObservable} from 'mobx';

import {placeholderGridSection, placeholderMarkdownSection} from '../Common';
import {GridModel} from '../Grid';
import {ValueModel} from '../Value';

class AbilitySection {
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

class AbilityModel {
  id;
  category = 'ability';
  name = '';
  stats = [];
  description = '';
  sections = [];
  upgrades = ['', '', ''];

  constructor(raw) {
    this.id = raw.id ?? crypto.randomUUID();
    if (raw) {
      this.name = raw.name;
      this.description = raw.description;
      if (raw.stats) {
        this.stats = raw.stats.map((x) => new ValueModel(x));
      }
      if (raw.sections) {
        this.sections = raw.sections.map((x) => new AbilitySection(x));
      }
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

  addMarkdownSection() {
    this.sections.push(new AbilitySection(placeholderMarkdownSection));
  }

  addGridSection() {
    this.sections.push(new AbilitySection(placeholderGridSection));
  }

  removeSection(i) {
    this.sections.splice(i, 1);
  }
}

export {AbilityModel};
