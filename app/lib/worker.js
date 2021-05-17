'use strict';

console.log('Run worker', process.pid);

process.on('message', (message) => {
  const { buffer, workerId, method } = message;

  const transform = require(method);

  if (buffer.type !== 'Buffer') {
    throw new Error('Invalid data type');
  }
  const data = new Uint8ClampedArray(buffer.data);
  const result = transform(data);

  const bufferRes = Buffer.from(result);
  process.send({ buffer: bufferRes, workerId });
});
