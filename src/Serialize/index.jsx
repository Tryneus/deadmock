const isZeroValue = (x) => (!x || x?.length === 0);
const coerceZero = (x) => {
  if (x === true) {
    return 1;
  } else if (x === false || x === null || x === undefined) {
    return 0;
  }
  return x;
};

const doSerialize = (x) => {
  let result = x?.serialize?.() || x;
  if (Array.isArray(result)) {
    result = result.map(doSerialize);
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
  model.prototype.serialize = function () {
    return pruneResult(fields.map(([name]) => {
      return doSerialize(this[name]);
    }));
  };

  model.deserialize = (data) => {
    const pairs = data.map((x, i) => {
      const [name, type] = fields[i];
      return [name, doDeserialize(x, type)];
    });
    return new model(Object.fromEntries(pairs.filter(([_, v]) => !isZeroValue(v))));
  };
};

export {serializeable};
