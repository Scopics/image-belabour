'use strict';

const transform = require('./transform');

console.log('Run worker', process.pid);

process.on('message', (message) => {
  const { buffer, workerId } = message;

  if (buffer.type !== 'Buffer') {
    throw new Error('Invalid data type');
  }
  const data = new Uint8ClampedArray(buffer.data);
  const result = transform(data);

  const bufferRes = Buffer.from(result);
  process.send({ buffer: bufferRes, workerId });
});
