'use strict';

const cachingRequire = require('./utils/cachingRequire');

console.log('Run worker', process.pid);

const transforms = new Map();
const crequire = cachingRequire(transforms, '../transform');

process.on('message', (message) => {
  const { task, workerId, method } = message;
  const transform = crequire(method);

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
