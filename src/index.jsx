import {render} from 'preact';

import {Config, ConfigContext} from '/src/Common';
import {Editor} from '/src/Editor';
import {State} from '/src/State';
import {ModelStorage, ModelStorageContext} from '/src/Serialize';
import {hydrate} from '/src/Serialize/compat';
import {ImageStorage, ImageStorageContext} from '/src/ImageStorage';
import '/src/preload';
import '/src/style.css';

const config = new Config({
  baseUrl: import.meta.env.BASE_URL,
});

const fragmentToRaw = () => {
  if (window.location.hash !== '' && window.location.hash !== '#') {
    try {
      const [version, modelData] = JSON.parse(window.atob(window.location.hash.replace('#', '')));
      const result = hydrate(modelData, version);
      window.location.hash = '';
      return result;
    } catch (err) {
      console.error('failed to load model from fragment:', err);
    }
  }
  return null;
};

const imageStorage = new ImageStorage();
const modelStorage = new ModelStorage();
const state = new State(modelStorage, fragmentToRaw());

const loadFromFragment = () => {
  const raw = fragmentToRaw();
  if (raw) {
    state.loadRaw(raw);
  }
};
window.addEventListener('hashchange', loadFromFragment);

// set CSS variable for scrollbar width for use in styling
const scrollbarWidth = window.innerWidth - document.body.clientWidth;
document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

render((
  <ConfigContext.Provider value={config}>
    <ImageStorageContext.Provider value={imageStorage}>
      <ModelStorageContext.Provider value={modelStorage}>
        <Editor state={state} />
      </ModelStorageContext.Provider>
    </ImageStorageContext.Provider>
  </ConfigContext.Provider>
), document.getElementById('app'));
