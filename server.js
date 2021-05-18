'use strict';

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const processingCore = require('./app/processing-core');
const MIME_TYPES = require('./MIME_TYPES.json');

const PORT = 8000;
const count = os.cpus().length;
const transformFilesPath = './app/transform/';
let methods;

const getBaseName = (file) => path.basename(file, '.js');

async function getMethods(directory) {
  return new Promise((resolve) => {
    fs.readdir(directory, (err, files) => {
      const baseNames = files.map(getBaseName);
      resolve(baseNames);
    });
  });
}

async function getArgs(req) {
  return new Promise((resolve) => {
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

function sendError(res) {
  res.statusCode = 500;
  res.end('Server error');
}

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const [urlPar1, urlPar2] = url.slice(1).split('/');
  const isApi = urlPar1 === 'api';
  if (isApi) {
    const method = urlPar2;
    if (!methods.includes(method)) {
      sendError(res);
      return;
    }
    const args = await getArgs(req);
    const imageData = args.data;
    const params = [imageData, count, method];
    const processedImage = await processingCore.balancer(...params);
    res.end(JSON.stringify(processedImage));
  } else {
    let fileExt = path.extname(url).slice(1);
    const isFile = fileExt.length > 0;
    const isMethod = methods.includes(urlPar1);
    if (!isFile && !isMethod) {
      sendError(res);
      return;
    }

    if (isMethod) fileExt = 'html';
    const file = path.join('./static', isMethod ? '/index.html' : url);
    const mimeType = MIME_TYPES[fileExt];

    fs.readFile(file, (err, data) => {
      if (err) {
        sendError(res);
        return;
      }
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(data);
    });
  }
});

async function startServer() {
  try {
    methods = await getMethods(transformFilesPath);
    processingCore.runner(count);
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (e) {
    console.log(e.message);
  }
}

startServer();
