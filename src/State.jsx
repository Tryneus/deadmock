import {autorun, makeAutoObservable, runInAction} from 'mobx';

import {AbilityModel} from './Ability/Model';
import {ItemModel} from './Item/Model';
import {examples} from './example';

const versionKey = 'version';
const historyKey = 'history';
const reservedKeys = [versionKey, historyKey];

const historyLimit = 10;

const serializationVersion = 'v1';
// activeItem: string (uuid key),
// activeAbility: string (uuid key),
// history: [{category: string, name: string, timestamp: number, key: string}...] (max length = historyLimit)

const storage = window.localStorage;

// No migrations are currently handled
const writeVersion = () => {
  const foundVersion = storage.getItem(versionKey);
  if (!foundVersion) {
    storage.setItem(versionKey, serializationVersion);
  } else if (foundVersion !== serializationVersion) {
    console.error('unsupported stored data version in localStorage', {expected: serializationVersion, found: foundVersion});
  }
};

const loadHistory = () => {
  const raw = storage.getItem(historyKey);
  return raw && JSON.parse(raw) || [];
};

const pushHistory = (model) => {
  const history = loadHistory(historyKey);
  const idx = history.findIndex((x) => x.id === model.id);
  if (idx >= 0) {
    history.splice(idx, 1);
  }
  history.unshift({id: model.id, category: model.category, name: model.name, timestamp: Date.now()});
  history.splice(historyLimit);
  storage.setItem(historyKey, JSON.stringify(history));
};

const clearHistory = (whitelist) => {
  const toDelete = [];
  const count = storage.length;
  for (let i = 0; i < count; i++) {
    const key = storage.key(i);
    if (!whitelist.has(key)) {
      toDelete.push(key);
    }
  }

  toDelete.forEach((key) => storage.removeItem(key));
};

const pruneStorage = () => {
  clearHistory(new Set([
    ...loadHistory().map((x) => x.id),
    ...reservedKeys,
  ]));
};

class State {
  activeModel = null;

  constructor() {
    writeVersion();

    const activeModel = loadHistory()?.[0]?.id;
    if (activeModel) {
      this.loadRecord(activeModel);
    } else {
      this.loadRaw(examples[0]);
    }

    makeAutoObservable(this);

    autorun(
      () => {
        if (this.activeModel) {
          storage.setItem(this.activeModel.id, JSON.stringify(this.activeModel));
          pushHistory(this.activeModel); // updates timestamp and snapshotted props
          pruneStorage();
        }
      },
      {delay: 100},
    );
  }

  loadRaw(raw) {
    if (raw.category === 'ability') {
      this._setActive(new AbilityModel(raw));
    } else {
      this._setActive(new ItemModel(raw));
    }
  }

  loadRecord(key) {
    const str = storage.getItem(key);
    if (str) {
      this.loadRaw(JSON.parse(str));
    } else {
      console.error('failed to load record from localStorage', key);
    }
  }

  clearData() {
    clearHistory(new Set([versionKey]));
    this.loadRaw(examples[0]);
  }

  serializeActive() {
    return [serializationVersion, this.activeModel.serialize()];
  }

  deserializeActive([version, modelData]) {
    if (!version) {
      throw new Error('missing a serialization version');
    } else if (version !== serializationVersion) {
      throw new Error(`unrecognized serialization version: ${JSON.stringify(version)}`);
    }

    // Category should be the first element
    const category = modelData[0];
    if (category === 'ability') {
      this._setActive(AbilityModel.deserialize(modelData));
    } else if (['weapon', 'vitality', 'spirit'].includes(category)) {
      this._setActive(ItemModel.deserialize(modelData));
    } else {
      throw new Error(`unrecognized model category: ${category}`);
    }
  }

  _setActive(model) {
    runInAction(() => {
      this.activeModel = model;
    });
  }
}

export {State, loadHistory, serializationVersion};
