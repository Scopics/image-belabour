'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const processingCore = require('./app/processing-core');

const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

const PORT = 8000;
const count = os.cpus().length;
const transformFilesPath = './app/transform/';
const api = new Map();
let methods;

const cacheFile = (directory, name) => {
  const filePath = path.resolve(__dirname, directory + name);
  const method = name.split('.')[0];
  try {
    const func = require(filePath);
    api.set(method, func);
    methods = Array.from(api.keys());
  } catch (e) {
    api.delete(method);
  }
};

function cacheFolder(directory) {
  const cacheFilePath = cacheFile.bind(null, directory);
  fs.readdir(directory, (err, files) => {
    files.forEach(cacheFilePath);
  });
}

async function getArgs(req) {
  return new Promise((resolve, reject) => {
    const chuncks = [];
    req.on('data', (chunck) => {
      chuncks.push(chunck);
    });
    req.on('end', () => {
      const args = JSON.parse(chuncks.join(''));
      resolve(args);
    });
  });
}

cacheFolder(transformFilesPath);

const server = http.createServer(async (req, res) => {
  const url = req.url;
  console.log(url);
  const urlSplitted = url.slice(1).split('/');
  const isApi = urlSplitted[0] === 'api';
  if (isApi) {
    const urlMethod = urlSplitted[1];
    const method = api.get(urlMethod);
    if (!method) {
      res.statusCode = 500;
      res.end('Unknown method');
      return;
    }
    const args = await getArgs(req);
    const imageData = args.data;
    const params = [imageData, count, urlMethod];
    const processedImage = await processingCore.balancer(...params);
    res.end(JSON.stringify(processedImage));
  } else {
    const isMethod = methods.includes(url.slice(1));
    const file = isMethod ? './static/index.html' : path.join('./static', url);
    const fileExt = path.extname(file).slice(1);
    if (!fileExt) {
      res.statusCode = 500;
      res.end('Unknown method');
      return;
    }
    const mimeType = MIME_TYPES[fileExt];
    try {
      fs.readFile(file, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Unknown method');
          return;
        }
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
      });
    } catch (e) {
      res.statusCode = 500;
      res.end('Unknown method');
      return;
    }
  }
});

processingCore.runner(count);
server.listen(PORT);
