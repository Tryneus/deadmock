import {AbilityModel} from '/src/Ability/Model';
import {deepCopy, isString} from '/src/Common';
import {ItemModel} from '/src/Item/Model';

import {latestVersion} from './versions';

const migrateV1Sections = (raw) => {
  return raw.map((x) => {
    if (isString(x)) {
      return {markdownData: x};
    }
    return {gridData: x};
  });
};

const migrateV1Details = (raw) => {
  const {description} = raw;
  const sections = migrateV1Sections(raw.sections);
  raw.details = {description, sections};
  delete raw.description;
  delete raw.sections;
};

const migrations = {
  v1: (raw) => {
    if (raw.category === 'ability') {
      migrateV1Details(raw);
    } else if (raw.effects) {
      raw.effects.forEach(migrateV1Details);
    }
    return raw;
  },
};

const migrate = (hydrated, version) => {
  if (version === latestVersion) {
    return hydrated;
  } else if (!migrations[version]) {
    throw new Error(`unknown version: ${version}`);
  }
  return migrations[version](deepCopy(hydrated));
};

const typeFromCategory = (category) => {
  if (category === 'ability') {
    return AbilityModel;
  } else if (['weapon', 'vitality', 'spirit'].includes(category)) {
    return ItemModel;
  }
  throw new Error(`unrecognized model category: ${category}`);
};

const hydrate = (serialized, version) => {
  // Category should be the first element
  const type = typeFromCategory(serialized[0]);
  return migrate(type.deserialize(serialized, version), version);
};

export {hydrate, migrate};
