import {autorun, makeAutoObservable, reaction, runInAction} from 'mobx';

import {AbilityModel} from './Ability';
import {ItemModel} from './Item';
import {examples} from './example';

const versionKey = 'version';
const historyKey = 'history';
const reservedKeys = [versionKey, historyKey];

const historyLimit = 10;

const version = 'v1';
// activeItem: string (uuid key),
// activeAbility: string (uuid key),
// history: [{category: string, name: string, timestamp: number, key: string}...] (max length = historyLimit)

const storage = window.localStorage;

const loadHistory = () => {
  const raw = storage.getItem(historyKey);
  return raw && JSON.parse(raw) || [];
};

const pushHistory = (model) => {
  console.log('pushHistory', model);
  const history = loadHistory(historyKey);
  const idx = history.findIndex((x) => x.id === model.id);
  if (idx >= 0) {
    history.splice(idx, 1);
  }
  history.unshift({id: model.id, category: model.category, name: model.name, timestamp: Date.now()});
  history.splice(historyLimit);
  storage.setItem(historyKey, JSON.stringify(history));
};

const pruneStorage = () => {
  const whitelist = new Set([
    ...loadHistory().map((x) => x.id),
    ...reservedKeys,
  ]);

  const count = storage.length;
  for (let i = 0; i < count; i++) {
    const key = storage.key(i);
    if (!whitelist.has(key)) {
      storage.removeItem(key);
    }
  }
};

class State {
  activeModel = null;

  constructor() {
    // No migrations are currently handled
    const foundVersion = storage.getItem(versionKey);
    if (!foundVersion) {
      storage.setItem(versionKey, version);
    } else if (foundVersion !== version) {
      console.error('unsupported stored data version in localStorage', {expected: version, found: foundVersion});
    }

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

  _setActive(model) {
    runInAction(() => {
      this.activeModel = model;
    });
  }
}

export {State, loadHistory};
