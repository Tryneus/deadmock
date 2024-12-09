import {makeAutoObservable} from 'mobx';

import {IconModel} from '../Icon';
import {serializeable} from '../Serialize';

class ValueModel {
  icon;
  signed = false;
  conditional = false;
  value = 0;
  units = '';
  stat = 'Stat';
  weight = null;
  color = null;
  spiritScaling = null;

  constructor(raw) {
    this.stat = raw?.stat || this.stat;
    this.value = raw?.value || this.value;
    this.units = raw?.units ?? this.units;
    this.color = raw?.color || this.color;
    this.weight = raw?.weight || this.weight;
    this.spiritScaling = raw?.spiritScaling || this.spiritScaling;
    this.signed = Boolean(raw?.signed);
    this.conditional = Boolean(raw?.conditional);
    this.icon = new IconModel(raw?.icon);

    makeAutoObservable(this);
  }
}

serializeable(ValueModel, [
  ['icon', IconModel],
  ['stat'],
  ['value'],
  ['units'],
  ['signed'],
  ['spiritScaling'],
  ['conditional'],
  ['weight'],
  ['color'],
]);

export {ValueModel};
