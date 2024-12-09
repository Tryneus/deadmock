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

  return coerceZero(result);
};

const doDeserialize = (data, type) => {
  if (Array.isArray(type)) {
    return data.map((x) => doDeserialize(x, type[0]));
  } else if (!type || !type.deserialize) {
    return data;
  }
  return type.deserialize(data);
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

const serializeable = (model, fields) => {
  model.prototype.serialize = function() {
    return pruneResult(fields.map(([field]) => {
      return doSerialize(model.name, field, this[field]);
    }));
  };

  model.deserialize = (data) => {
    const pairs = data.map((x, i) => {
      const [name, type] = fields[i];
      return [name, doDeserialize(x, type)];
    });
    return new model(Object.fromEntries(pairs.filter(([, v]) => !isZeroValue(v))));
  };
};

export {serializeable};
