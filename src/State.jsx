import {autorun, makeAutoObservable, runInAction} from 'mobx';

import {AbilityModel} from './Ability/Model';
import {ItemModel} from './Item/Model';
import {examples, latestVersion, versions} from './Serialize';
import {hydrate, migrate} from './Serialize/compat';

const versionKey = 'version';
const historyKey = 'history';
const reservedKeys = [versionKey, historyKey];
const historyLimit = 10;
const storage = window.localStorage;

// This currently handles the v1 -> v2 migration
const migrateStorage = (fromVersion) => {
  // Migrate all items and abilities, but currently the reserved keys need no migrations
  const count = storage.length;
  for (let i = 0; i < count; i++) {
    const key = storage.key(i);
    if (!reservedKeys.includes(key)) {
      const data = JSON.parse(storage.getItem(key));
      storage.setItem(key, JSON.stringify(migrate(data, fromVersion)));
    }
  }

  storage.setItem(versionKey, latestVersion);
};

const writeVersion = () => {
  console.log(versions);
  const foundVersion = storage.getItem(versionKey);
  if (!foundVersion) {
    storage.setItem(versionKey, latestVersion);
  } else if (foundVersion !== latestVersion) {
    if (versions.includes(foundVersion)) {
      migrateStorage(foundVersion);
    } else {
      console.error('unsupported stored data version in localStorage', foundVersion);
    }
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
    return [latestVersion, this.activeModel.serialize()];
  }

  deserializeActive([version, modelData]) {
    if (!version) {
      throw new Error('missing a serialization version');
    }
    this.loadRaw(hydrate(modelData, version));
  }

  _setActive(model) {
    runInAction(() => {
      this.activeModel = model;
    });
  }
}

export {State, loadHistory};
