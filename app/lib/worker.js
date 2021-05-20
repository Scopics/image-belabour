'use strict';

const path = require('path');

console.log('Run worker', process.pid);

const transforms = new Map();

const cachingRequire = (module) => {
  const methodPath = path.resolve(__dirname, '../transform', `${module}.js`);
  const key = path.basename(methodPath, '.js');
  if (transforms.has(key)) return transforms.get(key);

  try {
    const method = require(methodPath);
    transforms.set(key, method);
  } catch (e) {
    transforms.delete(key);
  }

  return transforms.get(key);
};

process.on('message', (message) => {
  const { task, workerId, method } = message;
  const transform = cachingRequire(method);

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
