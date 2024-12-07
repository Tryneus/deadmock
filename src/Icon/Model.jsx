import {makeAutoObservable} from 'mobx';

class IconModel {
  image = 'stat/placeholder';
  color = 'grey';
  large = false;

  constructor(raw) {
    this.image = raw?.image || this.image;
    this.color = raw?.color || this.color;
    this.large = raw?.large || this.large;
    makeAutoObservable(this);
  }
}

export {IconModel};
