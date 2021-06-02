'use strict';

const fs = require('fs');
const path = require('path');
const processingCore = require('../app/processing-core.js');
const MIME_TYPES = require('./MIME_TYPES.json');
const { count } = require('./config.js');

const getBaseName = (file) => path.basename(file, '.js');

const getMethods = (directory) =>
  new Promise((resolve) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        resolve([]);
        return;
      }
      const baseNames = files.map(getBaseName);
      resolve(baseNames);
    });
  });

const getArgs = async (req) => {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  return Buffer.concat(buffers).toString();
};

function sendError(res, statusCode, message) {
  res.statusCode = statusCode || 500;
  res.end(message || 'Server error');
}

function sendFile(res, file, fileExt) {
  const mimeType = MIME_TYPES[fileExt];

  const stream = fs.createReadStream(file, 'utf8');
  if (stream) {
    res.writeHead(200, { 'Content-Type': mimeType });
    stream.pipe(res);
  } else {
    sendError(res, 404, 'Not found');
  }
}

async function processImage(req, method) {
  const args = await getArgs(req);
  const body = JSON.parse(args);
  const imageData = body.data;
  const params = [imageData, count, method];
  const processedImage = processingCore.balancer(...params);
  return processedImage;
}

module.exports = {
  getMethods,
  sendError,
  sendFile,
  processImage,
};
