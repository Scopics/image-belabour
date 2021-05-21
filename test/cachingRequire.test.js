'use strict';

const metatests = require('metatests');
const path = require('path');
const fs = require('fs');
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

metatests.test('test cachingRequire get module', (test) => {
  const crequire = cachingRequire();
  const pathLib = path.resolve(__dirname, '../app/processing-core');
  const pathNoExist = path.resolve(__dirname, 'bad-file.js');

  const expected = require(pathLib);
  const actual = crequire(pathLib);
  const actualCache = crequire(pathLib);
  const actualNoExistPath = crequire(pathNoExist);

  test.strictSame(
    actual,
    expected,
    'module not from the cache returns unexpected results'
  );
  test.strictSame(
    actualCache,
    expected,
    'module from the cache returns unexpected results'
  );
  test.strictSame(
    actualNoExistPath,
    undefined,
    'with a module that does not exist we should get undefined'
  );
  test.end();
});

metatests.test('test cachingRequire deleting modules from cache', (test) => {
  const crequire = cachingRequire(1);
  const pathLib1 = path.resolve(__dirname, 'test.js');
  const pathLib2 = path.resolve(__dirname, '../app/processing-core');

  fs.writeFileSync(pathLib1, 'module.exports = 5;', 'utf8');
  const actual1 = crequire(pathLib1);
  const actual2 = crequire(pathLib2);

  fs.writeFileSync(pathLib1, 'module.exports = 6;', 'utf8');
  const actual1NotCached = crequire(pathLib1);

  fs.rmSync(pathLib1);
  test.equal(actual1, 5, 'Value not expected');
  test.equal(actual1NotCached, 6, 'The cache wasn\'t cleared');

  test.end();
});
