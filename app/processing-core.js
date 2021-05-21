'use strict';

const cp = require('child_process');

const workers = new Array();

const runner = (countWorkers) => {
  for (let i = 0; i < countWorkers; i++) {
    const worker = cp.fork('./app/lib/worker.js');
    console.log('Started worker:', worker.pid);
    workers.push(worker);
  }
  return workers.map((worker) => worker.pid);
};

const killer = () => {
  workers.forEach(worker => worker.kill('SIGTERM'));
};

const balancer = (data, countWorkers, method) => {
  const results = new Array(countWorkers);
  const len = data.length;
  const size = Math.floor(len / countWorkers);
  const tasks = [];
  for (let i = 0; i < countWorkers; i++) {
    const offset = i * size;
    const end = i === countWorkers - 1 ? len : offset + size;
    tasks[i] = data.slice(offset, end);
  }

  let finished = 0;

  return new Promise((resolve, reject) => {
    const onError = (err) => { 
      workers.forEach((worker) => {
        worker.removeListener('message', onMessage);
        worker.removeListener('error', onError);
      });
      reject(err);
    }

    const onMessage = (message) => {
      const { exportRes, workerId, error } = message;
      finished++;

      if (error) reject(error);
      if (!exportRes) {
        reject(
          new Error(
            'No transformation function, or the transformation was not successful'
          )
        );
      }

      results[workerId] = exportRes;
      if (finished === countWorkers) {
        workers.forEach((worker) => {
          worker.removeListener('message', onMessage);
          worker.removeListener('error', onError);
        });
        resolve(results);
      }
    };

    for (let i = 0; i < countWorkers; i++) {
      const worker = workers[i];
      worker.on('message', onMessage);
      worker.on('error', onError);

      worker.send({
        task: tasks[i],
        workerId: i,
        method,
      });
    }
  });
};

module.exports = {
  runner,
  killer,
  balancer,
};
