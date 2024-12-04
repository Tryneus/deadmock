import {autorun, makeAutoObservable, reaction, runInAction} from 'mobx';

import {AbilityModel} from './Ability';
import {ItemModel} from './Item';
import {defaultAbility, defaultItem} from './example';

const versionKey = 'version';
const modeKey = 'mode';
const itemHistoryKey = 'item-history';
const abilityHistoryKey = 'ability-history';
const reservedKeys = [versionKey, modeKey, itemHistoryKey, abilityHistoryKey];

const historyLimit = 10;

const version = 'v1';
// activeItem: string (uuid key),
// activeAbility: string (uuid key),
// history: [{category: string, name: string, timestamp: number, key: string}...] (max length = historyLimit)
// mode: string ('ability' | 'item')

const storage = window.localStorage;

const loadHistory = (key) => {
  const raw = storage.getItem(key);
  return raw && JSON.parse(raw) || [];
};

const loadAllHistory = () => {
  return [
    ...loadHistory(itemHistoryKey),
    ...loadHistory(abilityHistoryKey),
  ].sort((a, b) => {
    if (a.timestamp < b.timestamp) {
      return 1;
    } else if (b.timestamp < a.timestamp) {
      return -1;
    }
    return 0;
  });
};

const modelHistoryKey = (model) => {
  if (model instanceof ItemModel) {
    return itemHistoryKey;
  } else if (model instanceof AbilityModel) {
    return abilityHistoryKey;
  }
  console.error('unrecognized model type', model);
};

const pushHistory = (model) => {
  const historyKey = modelHistoryKey(model);
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
    ...loadHistory(itemHistoryKey).map((x) => x.id),
    ...loadHistory(abilityHistoryKey).map((x) => x.id),
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
  mode = 'ability';
  item = null;
  ability = null;

  constructor() {
    // No migrations are currently handled
    const foundVersion = storage.getItem(versionKey);
    if (!foundVersion) {
      storage.setItem(versionKey, version);
    } else if (foundVersion !== version) {
      console.error('unsupported stored data version in localStorage', {expected: version, found: foundVersion});
    }

    const activeItem = loadHistory(itemHistoryKey)?.[0]?.id;
    if (activeItem) {
      this.loadRecord(activeItem);
    } else {
      this.loadRaw(defaultItem);
    }

    const activeAbility = loadHistory(abilityHistoryKey)?.[0]?.id;
    if (activeAbility) {
      this.loadRecord(activeAbility);
    } else {
      this.loadRaw(defaultAbility);
    }

    this.mode = storage.getItem(modeKey) || this.mode;
    makeAutoObservable(this);

    // auto-sync mode to storage
    reaction(
      () => this.mode,
      () => {
        storage.setItem(modeKey, this.mode);
        if (this.mode === 'item') {
          pushHistory(this.item);
        } else if (this.mode === 'ability') {
          pushHistory(this.ability);
        }
      },
      {delay: 100},
    );
    autorun(
      () => {
        if (this.item && this.mode === 'item') {
          storage.setItem(this.item.id, JSON.stringify(this.item));
          pushHistory(this.item); // updates timestamp and snapshotted props
        }
      },
      {delay: 100},
    );
    autorun(
      () => {
        if (this.ability && this.mode === 'ability') {
          storage.setItem(this.ability.id, JSON.stringify(this.ability));
          pushHistory(this.ability);
        }
      },
      {delay: 100},
    );
  }

  loadRaw(raw) {
    if (raw.category === 'ability') {
      this._setAbility(new AbilityModel(raw));
    } else {
      this._setItem(new ItemModel(raw));
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

  setMode(mode) {
    if (['item', 'ability'].includes(mode)) {
      this.mode = mode;
    } else {
      console.error('unknown mode', mode);
    }
  }

  _setItem(model) {
    runInAction(() => {
      this.mode = 'item';
      this.item = model;
    });
  }

  _setAbility(model) {
    runInAction(() => {
      this.mode = 'ability';
      this.ability = model;
    });
  }
}

export {State, loadAllHistory};
