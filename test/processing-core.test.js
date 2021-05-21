'use strict';

const metatests = require('metatests');
const { balancer, killer, runner } = require('../app/processing-core');
const countWorkers = 8;

const testData = [
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 
  255, 1, 1, 181, 1, 20, 190, 122, 122, 254, 
];

metatests.testAsync('test balancer resolving data and rejecting errors', async (test) => {
  runner(countWorkers);
  const expected1 = new Error(
    'No transformation function, or the transformation was not successful'
  );
  const expected2 = new Error('Error to check the test');

  const processedData8Workers = [
    [ 255, 41, 41, 221, 41, 60, 230, 162, 162, 255, 255, 41 ],
    [ 41, 221, 41, 60, 230, 162, 162, 255, 255, 41, 41, 221 ],
    [ 41, 60, 230, 162, 162, 255, 255, 41, 41, 221, 41, 60 ],
    [ 230, 162, 162, 255, 255, 41, 41, 221, 41, 60, 230, 162 ],
    [ 162, 255, 255,  41, 41, 221, 41, 60, 230, 162, 162, 255 ],
    [ 255, 41, 41, 221, 41, 60, 230, 162, 162, 255, 255, 41 ],
    [ 41, 221, 41, 60, 230, 162, 162, 255, 255, 41, 41, 221 ],
    [ 41, 60, 230, 162, 162, 255, 255, 41, 41, 221, 41, 60, 230, 162, 162, 255 ],
  ];

  const processedData2Workers = [
    [
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
    ],
    [
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
    ],
  ];

  const processedData1Workers = [
    [
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
      255, 41, 41, 221, 41, 60, 230, 162, 162, 255,
    ]
  ];

  try {
    const data = await balancer(testData, 8, 'transform1');
    test.strictSame(data.length, 8, 'Data length != count of workers');
    test.strictSame(data, processedData8Workers, 'Calculation is wrong');
  } catch (err) {
    test.fail(err.message);
  }


  try {
    const data = await balancer(testData, 2, 'transform1');
    test.strictSame(data.length, 2, 'Data length != count of workers');
    test.strictSame(data, processedData2Workers, 'Calculation is wrong');
  } catch (err) {
    test.fail(err.message);
  }

  try {
    const data = await balancer(testData, 1, 'transform1');
    test.strictSame(data.length, 1, 'Data length != count of workers');
    test.strictSame(data, processedData1Workers, 'Calculation is wrong');
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
