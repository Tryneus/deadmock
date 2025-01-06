import {makeAutoObservable} from 'mobx';

import {serializeable} from '/src/Serialize/serialization';
import {ValueModel} from '/src/Value/Model';

class GridModel {
  cells = [];
  values = [];

  constructor(raw) {
    this.cells = raw?.cells?.map((x) => new ValueModel(x)) || this.cells;
    this.values = raw?.values?.map((x) => new ValueModel(x)) || this.values;
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

serializeable(GridModel, [
  ['cells', [ValueModel]],
  ['values', [ValueModel]],
]);

export {GridModel};
