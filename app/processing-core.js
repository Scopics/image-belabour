'use strict';

const cp = require('child_process');

const workers = new Array();

const runner = (countWorkers) => {
  for (let i = 0; i < countWorkers; i++) {
    const worker = cp.fork('./app/lib/worker.js');
    console.log('Started worker:', worker.pid);
    workers.push(worker);
  }
};

const balancer = (data, countWorkers, method) => {
  const results = new Array(countWorkers);
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
        method,
      });
    }
  });
};

module.exports = {
  runner,
  balancer,
};
