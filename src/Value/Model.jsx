import {makeAutoObservable} from 'mobx';

import {IconModel} from '../Icon';

class ValueModel {
  icon;
  signed = false;
  conditional = false;
  value = 0;
  units = '%';
  stat = 'Stat';
  weight = 400;
  color = null;
  spiritScaling = null;

  constructor(raw) {
    if (raw) {
      this.icon = new IconModel(raw.icon);
      this.signed = Boolean(raw.signed);
      this.conditional = Boolean(raw.conditional);

      this.value = raw.value ?? this.value;
      this.units = raw.units ?? this.units;
      this.stat = raw.stat ?? this.stat;
      this.weight = raw.weight ?? this.weight;

      this.color = raw.color;
      this.spiritScaling = raw.spiritScaling;
    } else {
      this.icon = new IconModel();
    }
    makeAutoObservable(this);
  }
}

export {ValueModel};
