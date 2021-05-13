'use strict';

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const worker = require('./lib/worker');
const jimp = require('jimp');

const filename = process.argv[2];
const fullPath = path.resolve(__dirname, filename);

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
  const data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    data[i] += 30;
    data[i + 1] += 30;
    data[i + 2] += 30;
  }
  const buff = Buffer.from(data);
  fsp.writeFile('res.jpg', buff);
});