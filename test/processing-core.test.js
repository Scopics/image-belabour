'use strict';

const metatests = require('metatests');
const { balancer, killer, runner } = require('../app/processing-core');
const countWorkers = 2;

const testData = [
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 197, 241,
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 197, 241,
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 197, 241,
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 197, 241,
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 197, 241,
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 197, 241,
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 197, 241,
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 197, 241,
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 197, 241,
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 197, 241,
];

metatests.testAsync('test balancer resolving data and rejecting errors', async (test) => {
  runner(countWorkers);
  const expected1 = new Error(
    'No transformation function, or the transformation was not successful'
  );
  const expected2 = new Error('Error to check the test');

  const processedData = [
    [
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255, 237, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255, 237, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255, 237, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255, 237, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255, 237, 255,
    ],
    [
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255, 237, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255, 237, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255, 237, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255, 237, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255, 237, 255,
    ],
  ];

  try {
    const data = await balancer(testData, countWorkers, 'transform1');
    test.strictSame(data, processedData, 'Calculation is wrong');
  } catch (err) {
    test.fail(err.message);
  }


  try {
    const data = await balancer(testData, countWorkers, 'transform5');
  } catch (err) {
    test.strictSame(
      err,
      expected1,
      'There must be an error with a non-existent method'
    );
  }

  try {
    const data = await balancer(testData, countWorkers, 'transform-error');
  } catch (err) {
    test.strictSame(
      err,
      expected2,
      'There must be an error with a non-existent method'
    );
  }

  killer();
  test.end();
});
