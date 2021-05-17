'use strict';

const path = require('path');

console.log('Run worker', process.pid);

process.on('message', (message) => {
  const { buffer, workerId, method } = message;

  const methodPath = path.resolve(__dirname, '../transform', `${method}.js`);
  const transform = require(methodPath);

  if (buffer.type !== 'Buffer') {
    throw new Error('Invalid data type');
  }
  const data = new Uint8ClampedArray(buffer.data);
  const result = transform(data);

  const bufferRes = Buffer.from(result);
  process.send({ buffer: bufferRes, workerId });
});
