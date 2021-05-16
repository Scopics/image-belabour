'use strict';

const transform = require('./transform');
const v8 = require('v8');

console.log('Run worker', process.pid);

process.on('message', message => {
  if (message.type === 'Buffer') console.log('Good');

  const { data }= message;
  console.log( data.length )
  const result = transform(data);

  const resultSerealized = v8.serialize(new Uint8ClampedArray(result));
  process.send(resultSerealized);
});
