import {autorun, makeAutoObservable, reaction, runInAction} from 'mobx';

import {AbilityModel} from './Ability';
import {ItemModel} from './Item';
import {exampleAbility, exampleItem} from './example';

const versionKey = 'version';
const modeKey = 'mode';
const itemHistoryKey = 'item-history';
const abilityHistoryKey = 'ability-history';
const reservedKeys = [versionKey, modeKey, itemHistoryKey, abilityHistoryKey];

const historyLimit = 20;

const version = 'v1';
// activeItem: string (uuid key),
// activeAbility: string (uuid key),
// history: [{type: string, name: string, timestamp: number, key: string}...] (max length = historyLimit)
// mode: string ('ability' | 'item')

const storage = window.localStorage;

const loadHistory = (key) => {
  const raw = storage.getItem(key);
  return raw && JSON.parse(raw) || [];
};

const pushHistory = (model) => {
  if (model instanceof ItemModel) {
    const history = loadHistory(itemHistoryKey);
    const idx = history.findIndex((x) => x.id === model.id);
    if (idx >= 0) {
      history.splice(idx, 1);
    }
    history.unshift({id: model.id, category: model.category, name: model.name, timestamp: Date.now()});
    history.splice(historyLimit);
    storage.setItem(itemHistoryKey, JSON.stringify(history));
  } else if (model instanceof AbilityModel) {
    const history = loadHistory(abilityHistoryKey);
    const idx = history.findIndex((x) => x.id === model.id);
    if (idx >= 0) {
      history.splice(idx, 1);
    }
    history.unshift({id: model.id, name: model.name, timestamp: Date.now()});
    history.splice(historyLimit);
    storage.setItem(abilityHistoryKey, JSON.stringify(history));
  } else {
    console.error('unrecognized model type', model);
  }
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
      this.loadItem(activeItem);
    } else {
      this.useTemplateItem(exampleItem);
    }

    const activeAbility = loadHistory(abilityHistoryKey)?.[0]?.id;
    if (activeAbility) {
      this.loadAbility(activeAbility);
    } else {
      this.useTemplateAbility(exampleAbility);
    }

    this.mode = storage.getItem(modeKey) || this.mode;
    makeAutoObservable(this);

    // auto-sync mode to storage
    reaction(
      () => this.mode,
      () => storage.setItem(modeKey, this.mode),
      {delay: 100},
    );
    autorun(
      () => {
        if (this.item) {
          storage.setItem(this.item.id, JSON.stringify(this.item));
          pushHistory(this.item); // updates timestamp and snapshotted props
        }
      },
      {delay: 100},
    );
    autorun(
      () => {
        if (this.ability) {
          storage.setItem(this.ability.id, JSON.stringify(this.ability));
          pushHistory(this.ability);
        }
      },
      {delay: 100},
    );
  }

  useTemplateItem(raw) {
    this._setItem(new ItemModel(raw));
  }

  useTemplateAbility(raw) {
    this._setAbility(new AbilityModel(raw));
  }

  loadItem(key) {
    const itemData = storage.getItem(key);
    if (itemData) {
      this._setItem(new ItemModel(JSON.parse(itemData)));
    } else {
      console.error('failed to load item', key);
    }
  }

  loadAbility(key) {
    const abilityData = storage.getItem(key);
    if (abilityData) {
      this._setAbility(new AbilityModel(JSON.parse(abilityData)));
    } else {
      console.error('failed to load ability', key);
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

export {State};
