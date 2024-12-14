import {makeAutoObservable} from 'mobx';

import {deepCopy, isString, placeholderGrid, placeholderMarkdown} from '../Common';
import {GridModel} from '../Grid/Model';
import {serializeable} from '../Serialize';
import {ValueModel} from '../Value/Model';

class AbilityModel {
  id;
  category = 'ability';
  name = '';
  stats = [];
  description = placeholderMarkdown;
  sections = [];
  upgrades = ['', '', ''];

  constructor(raw) {
    this.id = raw?.id || crypto.randomUUID();
    this.category = raw?.category || this.category;
    this.name = raw?.name || this.name;
    this.description = raw?.description ?? this.description;
    this.stats = raw?.stats?.map((x) => new ValueModel(x)) || this.stats;
    this.sections = raw?.sections?.map((x) => (isString(x) ? x : new GridModel(x))) || this.sections;
    this.upgrades = deepCopy(raw?.upgrades || this.upgrades);
    makeAutoObservable(this);
  }

  addStat(raw) {
    this.stats.push(new ValueModel(raw));
  }

  removeStat(i) {
    this.stats.splice(i, 1);
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

serializeable(AbilityModel, [
  ['category'],
  ['name'],
  ['stats', [ValueModel]],
  ['description'],
  ['sections', [GridModel]],
  ['upgrades'],
]);

export {AbilityModel};
