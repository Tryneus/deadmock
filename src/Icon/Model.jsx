import {makeAutoObservable} from 'mobx';

class IconModel {
  image = 'stat/placeholder';
  color = 'grey';

  constructor(raw) {
    if (raw && raw.image) {
      this.image = raw.image;
    }
    if (raw && raw.color) {
      this.color = raw.color;
    }
    makeAutoObservable(this);
  }
}

export {IconModel};
