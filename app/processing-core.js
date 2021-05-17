'use strict';

const path = require('path');
const cp = require('child_process');
const jimp = require('jimp');

const filename = process.argv[2];
const fullPath = path.resolve(__dirname, filename);
const cpuCount = 2;
const workers = [];

for (let i = 0; i < cpuCount; i++) {
  const worker = cp.fork('./lib/worker.js');
  console.log('Started worker:', worker.pid);
  workers.push(worker);
}

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
  balancer(imageData, cpuCount).then((data) => {
    console.log(data);
    process.exit(0);
  });
});

const balancer = (imageData, countWorkers) => {
  const results = new Array(countWorkers);
  const { data } = imageData;
  const len = data.length;
  const size = Math.floor(len / countWorkers);
  const tasks = [];
  for (let i = 0; i < countWorkers; i++) {
    tasks[i] = Buffer.from(data.slice(i * size, i * size + size));
  }

  let finished = 0;

  return new Promise((resolve) => {
    for (let i = 0; i < countWorkers; i++) {
      workers[i].on('message', (message) => {
        const { buffer, workerId } = message;
        results[workerId] = buffer.data;

        finished++;
        if (finished === countWorkers) {
          resolve(results);
        }
      });

      workers[i].send({
        buffer: tasks[i],
        workerId: i,
      });
    }
  });
};
