import {createContext} from 'preact';

import {migrate} from './compat';
import {latestVersion, versions} from './versions';

const versionKey = 'version';
const historyKey = 'history';
const reservedKeys = [versionKey, historyKey];

const ModelStorageContext = createContext(null);

class ModelStorage {
  constructor(options) {
    this._storage = options?.storage || window.localStorage;
  }

  _writeVersion() {
    this._storage.setItem(versionKey, latestVersion);
  }

  // This currently handles the v1 -> v2 migration
  migrate() {
    const foundVersion = this._storage.getItem(versionKey);
    if (foundVersion && foundVersion !== latestVersion) {
      if (versions.includes(foundVersion)) {
        // Migrate all entries, but currently the reserved keys need no migrations
        const count = this._storage.length;
        for (let i = 0; i < count; i++) {
          const key = this._storage.key(i);
          if (!reservedKeys.includes(key)) {
            const data = JSON.parse(this._storage.getItem(key));
            this._storage.setItem(key, JSON.stringify(migrate(data, foundVersion)));
          }
        }
      } else {
        console.error('unsupported stored data version in localStorage', foundVersion);
      }
    }
    this._writeVersion();
  }

  history() {
    const raw = this._storage.getItem(historyKey);
    const result = raw && JSON.parse(raw) || [];
    if (result.length > 0) {
      return result;
    }

    // History is missing - regenerate a history with all parseable models in localstorage
    const count = this._storage.length;
    for (let i = 0; i < count; i++) {
      const key = this._storage.key(i);
      if (!reservedKeys.includes(key)) {
        const model = this.load(key);
        if (model && model.id && model.category && model.name) {
          result.unshift({id: model.id, category: model.category, name: model.name, timestamp: Date.now()});
        }
      }
    }

    this._storage.setItem(historyKey, JSON.stringify(result));
    return result;
  }

  save(model) {
    const h = this.history();
    const idx = h.findIndex((x) => x.id === model.id);
    if (idx >= 0) {
      h.splice(idx, 1);
    }
    h.unshift({id: model.id, category: model.category, name: model.name, timestamp: Date.now()});
    this._storage.setItem(historyKey, JSON.stringify(h));
    this._storage.setItem(model.id, JSON.stringify(model));
  }

  load(key) {
    const str = this._storage.getItem(key);
    return str ? JSON.parse(str) : null;
  }

  remove(key) {
    const h = this.history().filter((x) => x.id !== key);
    this._storage.setItem(historyKey, JSON.stringify(h));
    this._storage.removeItem(key);
  }

  clear() {
    const toDelete = [];
    const count = this._storage.length;
    for (let i = 0; i < count; i++) {
      const key = this._storage.key(i);
      toDelete.push(key);
    }

    toDelete.forEach((key) => this._storage.removeItem(key));
    this._writeVersion();
  }
}

export {ModelStorage, ModelStorageContext};
