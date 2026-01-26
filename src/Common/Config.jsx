import {createContext} from 'preact';

class Config {
  constructor(options) {
    this.baseUrl = options?.baseUrl || '/';
  }
}

const ConfigContext = createContext(new Config());

export {Config, ConfigContext};
