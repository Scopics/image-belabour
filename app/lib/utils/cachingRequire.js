'use strict';

const path = require('path');

const cachingRequire = (collection, folder) => (module) => {
  const methodPath = path.resolve(__dirname, folder, `${module}.js`);
  const key = path.basename(methodPath, '.js');
  if (collection.has(key)) return collection.get(key);

  try {
    const method = require(methodPath);
    collection.set(key, method);
  } catch (e) {
    collection.delete(key);
  }

  return collection.get(key);
};

module.exports = cachingRequire;
