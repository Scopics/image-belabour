'use strict';

const cp = require('child_process');
const util = require('util');
const forkPromisified = util.promisify(cp.fork);

const workers = new Array();

const runner = async (countWorkers) => {
  for (let i = 0; i < countWorkers; i++) {
    const worker = await forkPromisified('./app/lib/worker.js');
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
    tasks[i] = data.slice(i * size, i * size + size);
  }

  let finished = 0;

  return new Promise((resolve, reject) => {
    for (let i = 0; i < countWorkers; i++) {
      workers[i].on('message', (message) => {
        const { exportRes, workerId } = message;
        results[workerId] = exportRes;

        finished++;
        if (finished === countWorkers) {
          resolve(results);
        }
      });

      workers[i].on('error', (err) => reject(err));

      workers[i].send({
        task: tasks[i],
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
