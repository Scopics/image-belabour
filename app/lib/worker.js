'use strict';

const path = require('path');

console.log('Run worker', process.pid);

process.on('message', (message) => {
  const { task, workerId, method } = message;

  const methodPath = path.resolve(__dirname, '../transform', `${method}.js`);
  const transform = require(methodPath);

  const data = new Uint8ClampedArray(task);
  const result = transform(data);

  const exportRes = Array.from(result);
  process.send({ exportRes, workerId });
});
