import {autorun, makeAutoObservable, runInAction} from 'mobx';

import {AbilityModel} from '/src/Ability/Model';
import {HeroModel} from '/src/Hero/Model';
import {ItemModel} from '/src/Item/Model';
import {templates} from '/src/Serialize';

class State {
  activeModel = null;
  _modelStorage = null;

  constructor(modelStorage, initialRaw) {
    this._modelStorage = modelStorage;
    this._modelStorage.migrate();
    this._initializeModel(initialRaw);

    makeAutoObservable(this);
    autorun(() => this._flush(), {delay: 100});
    window.addEventListener('popstate', () => {
      const id = history.state?.id;
      const raw = id && this._modelStorage.load(id);
      this._initializeModel(raw);
    });
  }

  // Get a valid model loaded - either use the provided raw data, load the
  // latest model from the localStorage history, or toss the default template
  // into a new model.
  _initializeModel(raw) {
    const latestId = this._modelStorage.history()?.[0]?.id;
    if (raw) {
      this.loadRaw(raw, {noHistory: true});
    } else if (latestId) {
      this.loadRecord(latestId, {noHistory: true});
    } else {
      this.loadRaw(templates[0].data, {noHistory: true});
    }
    history.replaceState({
      id:    this.activeModel.id,
      depth: history.state?.depth || 0,
    }, '');
  }

  loadRaw(raw, options) {
    if (raw.category === 'ability') {
      this._setActive(new AbilityModel(raw));
    } else if (raw.category === 'hero') {
      this._setActive(new HeroModel(raw));
    } else {
      this._setActive(new ItemModel(raw));
    }

    if (!options?.noHistory) {
      const depth = history.state.depth + 1;
      const {id, name} = this.activeModel;
      history.pushState({id, depth}, `Deadmock - ${name}`);
      window.scrollTo({top: 0});
    }
  }

  loadRecord(key, options) {
    const raw = this._modelStorage.load(key);
    if (raw) {
      this.loadRaw(raw, options);
    } else {
      console.error('failed to load record from localStorage', key);
    }
  }

  clearAll() {
    this._modelStorage.clear();
    this.activeModel = null;

    const depth = history.state?.depth || 0;
    if (depth === 0) {
      // avoid an unnecessary refresh and just load straightaway
      this._initializeModel(null);
    } else {
      history.go(-history.state.depth);
    }
  }

  _setActive(model) {
    this._flush();
    runInAction(() => {
      this.activeModel = model;
    });
  }

  _flush() {
    if (this.activeModel) {
      this._modelStorage.save(this.activeModel);
    }
  }
}

export {State};
