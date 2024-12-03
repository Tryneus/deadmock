import {makeAutoObservable} from 'mobx';

import {ValueModel} from '../Value';

class GridModel {
  cells = [];
  values = [];

  constructor(raw) {
    if (raw) {
      if (raw.cells) {
        this.cells = raw.cells.map((x) => new ValueModel(x));
      }
      if (raw.values) {
        this.values = raw.values.map((x) => new ValueModel(x));
      }
    }
    makeAutoObservable(this);
  }

  addCell(raw) {
    this.cells.push(new ValueModel(raw));
  }

  removeCell(i) {
    this.cells.splice(i, 1);
  }

  addValue(raw) {
    this.values.push(new ValueModel(raw));
  }

  removeValue(i) {
    this.values.splice(i, 1);
  }
}

export {GridModel};
