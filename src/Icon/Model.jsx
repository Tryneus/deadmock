import {makeAutoObservable} from 'mobx';

import {serializeable} from '/src/Serialize';

class IconModel {
  image = 'stat/placeholder';
  color = 'grey';
  large = false;

  constructor(raw) {
    this.image = raw?.image || this.image;
    this.color = raw?.color || this.color;
    this.large = Boolean(raw?.large);
    makeAutoObservable(this);
  }
}

serializeable(IconModel, [
  ['image'],
  ['color'],
  ['large'],
]);

export {IconModel};
