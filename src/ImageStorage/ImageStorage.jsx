import {del, get, keys, set} from 'idb-keyval';
import {createContext} from 'preact';

const ImageStorageContext = createContext(null);

const convertToDataUrl = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target.result);
    reader.readAsDataURL(file);
  });
};

class ImageCache {
  data;

  constructor() {
    this.data = {};
  }

  store(obj) {
    obj.key = crypto.randomUUID();
    obj.timestamp = Date.now();
    this.data[obj.key] = Promise.resolve(obj);
    return set(obj.key, obj).then(() => obj.key);
  }

  retrieve(key) {
    if (this.data[key]) {
      return this.data[key];
    }
    return get(key).then((obj) => {
      if (!obj) {
        throw new Error(`file data not found for key: ${key}`);
      }
      return obj;
    });
  }

  remove(key) {
    return del(key).then(() => delete this.data[key]);
  }

  list() {
    return keys();
  }
}

// Provides a view of a subset of the cache, files of the given 'type' (i.e.
// icon or portrait images).
class Substorage {
  _type;
  _cache;

  constructor(type, cache) {
    this._type = type;
    this._cache = cache;
  }

  store(file) {
    return this._cache.store({type: this._type, file});
  }

  retrieve(id) {
    return this._cache.retrieve(id).then((obj) => {
      if (obj.type !== this._type) {
        throw new Error(`expected file of type ${this._type} but found ${obj.type}`);
      }
      return convertToDataUrl(obj.file);
    });
  }

  remove(id) {
    return this._cache.remove(id);
  }

  list() {
    return this._cache.list().then((ids) => {
      return Promise.all(ids.map((id) => this._cache.retrieve(id))).then((objs) => {
        return ids.filter((id, i) => objs[i].type === this._type);
      });
    });
  }
}

class ImageStorage {
  constructor() {
    this._cache = new ImageCache();
    this.portrait = new Substorage('portrait', this._cache);
    this.icon = new Substorage('icon', this._cache);
  }
}

export {ImageStorage, ImageStorageContext, convertToDataUrl};
