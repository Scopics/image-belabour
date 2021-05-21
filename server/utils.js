const fs = require('fs');
const path = require('path');
const processingCore = require('../app/processing-core');
const MIME_TYPES = require('./MIME_TYPES.json');
const { count } = require('./config');

const getBaseName = (file) => path.basename(file, '.js');

function getMethods(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) reject(err);
      const baseNames = files.map(getBaseName);
      resolve(baseNames);
    });
  });
}

function getArgs(req) {
  return new Promise((resolve, reject) => {
    const chuncks = [];
    try {
      req.on('data', (chunck) => {
        chuncks.push(chunck);
      });
      req.on('end', () => {
        const args = JSON.parse(chuncks.join(''));
        resolve(args);
      });
    } catch (e) {
      reject(e);
    }
  });
}

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
  const imageData = args.data;
  const params = [imageData, count, method];
  const processedImage = processingCore.balancer(...params);
  return processedImage;
}

module.exports = {
  getMethods,
  sendError,
  sendFile,
  processImage
}