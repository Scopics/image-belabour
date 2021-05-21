'use strict';

const path = require('path');

const cachingRequire = (cacheSize = 10) => {
  if (!Number.isInteger(cacheSize) || cacheSize <= 0) {
    throw new Error('Cache size must be positive number');
  }
  const modules = new Map();
  return (methodPath, options = {}) => {
    const key = path.basename(methodPath, '.js');
    if (modules.has(key) && !options.update) return modules.get(key);

    try {
      const libPath = require.resolve(methodPath);
      delete require.cache[libPath];
    } catch (e) {
      return;
    }

    try {
      const method = require(methodPath);
      modules.set(key, method);
      const modSize = modules.size;
      if (modSize > cacheSize) {
        const keys = [...modules.keys()];
        const overSize = modSize - cacheSize;
        for (let i = 0; i < overSize; i++) {
          const key = keys[i];
          modules.delete(key);
        }
      }
    } catch (e) {
      modules.delete(key);
    }

    return modules.get(key);
  };
};

module.exports = cachingRequire;
