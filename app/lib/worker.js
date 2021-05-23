'use strict';

const path = require('path');
const cachingRequire= require('./utils/cachingRequire');
const crequire = cachingRequire();


process.on('message', (message) => {
  const { task, workerId, method } = message;
  const methodPath = path.resolve(__dirname, '../transform', `${method}.js`);
  const transform = crequire(methodPath);

  if (transform) {
    try {
      const data = new Uint8ClampedArray(task);
      const result = transform(data);

      const exportRes = Array.from(result);
      process.send({ exportRes, workerId });
    } catch (error) {
      process.send({ workerId, error });
    }
  } else {
    process.send({ workerId });
  }
});
