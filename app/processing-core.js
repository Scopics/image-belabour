'use strict';

const path = require('path');
const cp = require('child_process');
const v8 = require('v8');
const jimp = require('jimp');

const filename = process.argv[2];
const fullPath = path.resolve(__dirname, filename);
const cpuCount = 1;
const workers = [];
const results = [];

for (let i = 0; i < cpuCount; i++) {
  const worker = cp.fork('./lib/worker.js');
  console.log('Started worker:', worker.pid);
  workers.push(worker);
}

workers.forEach((worker) => {
  worker.on('message', message => {

    console.log('Message from worker', worker.pid);

    results.push(message.data)
    if (results.length === cpuCount) {
      console.log(results);
      process.exit(0);
    }
  });
});

const get = (src, cb) => {
  jimp.read(src).then((img) => {
    cb(null, {
      data: new Uint8ClampedArray(img.bitmap.data),
      height: img.bitmap.height,
      width: img.bitmap.width,
    });
  }, cb);
};

get(fullPath, (err, imageData) => {
  if (err) throw err;
  
  console.log(imageData.data);
  const data = v8.serialize(imageData.data);
  workers.forEach((worker) => {
    worker.send(data);
  })
});

const balancer = (imageData, countWorkers) => {
  const { data, width, height } = imageData;
  const blockSize = Math.floor(data.length / countWorkers);

  
}