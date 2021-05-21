'use strict';

const metatests = require('metatests');
const cachingRequire = require('../app/lib/utils/cachingRequire');

metatests.test('test cachingRequire init valid ToPASS', (test) => {
  test.doesNotThrow(() => cachingRequire(1));
  test.doesNotThrow(() => cachingRequire(Number.MAX_VALUE));
  test.doesNotThrow(() => cachingRequire());
  test.end();
});

metatests.test('test cachingRequire init non-valid ToTRHOW', (test) => {
  test.throws(() => cachingRequire(-1));
  test.throws(() => cachingRequire(0));
  test.throws(() => cachingRequire(1.01));
  test.throws(() => cachingRequire(Number.MIN_VALUE));
  test.throws(() => cachingRequire(null));
  test.throws(() => cachingRequire(NaN));
  test.end();
});
