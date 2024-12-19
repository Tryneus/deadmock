import {latestVersion} from './versions';

const isZeroValue = (x) => !x || x?.length === 0;
const coerceZero = (x) => {
  if (x === true) {
    return 1;
  } else if (x === false || x === null || x === undefined) {
    return 0;
  }
  return x;
};

const doSerialize = (typename, field, value) => {
  let result = value?.serialize?.() || value;

  if (Array.isArray(result)) {
    result = result.map((x) => doSerialize(typename, `${field}[]`, x));
  }

  // Optimizations for large zero-values
  if (typename === 'IconModel') {
    if (field === 'image' && value === 'stat/placeholder') {
      return 0;
    } else if (field === 'color' && value === 'grey') {
      return 0;
    }
  }

  if (typename === 'ValueModel') {
    if (field === 'stat' && value === 'stat') {
      return 0;
    }
  }

  return coerceZero(result);
};

const doDeserialize = (data, type, version) => {
  if (Array.isArray(type)) {
    return data.map((x) => doDeserialize(x, type[0], version));
  } else if (!type || !type.deserialize) {
    return data;
  }
  return type.deserialize(data, version);
};

const pruneResult = (x) => {
  if (!Array.isArray(x)) {
    return x;
  }
  let lastNonZeroIndex = x.length - 1;
  while (x[lastNonZeroIndex] === 0) {
    lastNonZeroIndex--;
  }
  return x.slice(0, lastNonZeroIndex + 1);
};

const serializeable = (model, fieldsData) => {
  const fieldsVersions = Array.isArray(fieldsData) ?
    {[latestVersion]: fieldsData} :
    fieldsData;
  const latestFields = fieldsVersions[latestVersion];

  model.prototype.serialize = function() {
    return pruneResult(latestFields.map(([field]) => {
      return doSerialize(model.name, field, this[field]);
    }));
  };

  model.deserialize = (data, version) => {
    // TODO: should use the next-newest fields version, but at the moment that
    // can't be anything but the latest, so future me can deal with it
    const fields = fieldsVersions[version] || latestFields;
    if (!Array.isArray(data)) {
      return data;
    }

    console.log(model, fields);

    const pairs = data.map((x, i) => {
      const [name, type] = fields[i];
      return [name, doDeserialize(x, type, version)];
    });
    return Object.fromEntries(pairs.filter(([, v]) => !isZeroValue(v)));
  };
};

export {serializeable};
