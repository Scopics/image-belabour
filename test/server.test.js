'use strict';

const path = require('path');
const metatests = require('metatests');
const {
  getMethods,
  sendError,
  sendFile,
  processImage
} = require('../server/utils');

metatests.test('test getMethods function', async (test) => {
  const testData = [
    {
      args: [path.join(__dirname, '../app/transform')],
      expected: ['brightness', 'graysacle', 'transform-error', 'transform1', 'transform2']
    },
    {
      args: [path.join(__dirname, '../app/transform/unexist')],
      expected: []
    },
  ]
  const totalTests = testData.length;

  for (const index in testData) {
    const data = testData[index];
    const result = await getMethods(...data.args);
    await test.strictSame(result, data.expected);

    if (index === totalTests - 1) {
      test.end();
    }
  }
});
