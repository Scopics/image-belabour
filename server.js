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
const methods = new Set();

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

const server = http.createServer(async (req, res) => {
  const url = req.url;
  const [urlPar1, urlPar2] = url.slice(1).split('/');
  const isApi = urlPar1 === 'api';
  if (isApi) {
    const method = urlPar2;
    if (!methods.has(method)) {
      sendError(res, 404, 'Not Found');
      return;
    }
    try {
      const args = await getArgs(req);
      const imageData = args.data;
      const params = [imageData, count, method];
      const processedImage = await processingCore.balancer(...params);
      res.end(JSON.stringify(processedImage));
    } catch (e) {
      sendError(res);
      return;
    }
  } else {
    let fileExt = path.extname(url).slice(1);
    const isFile = fileExt.length > 0;
    const isMethod = methods.has(urlPar1);
    if (!isFile && !isMethod) {
      sendError(res, 404, 'Not Found');
      return;
    }

    if (isMethod) fileExt = 'html';
    const file = path.join('./static', isMethod ? '/index.html' : url);
    const mimeType = MIME_TYPES[fileExt];

    try {
      const rs = fs.createReadStream(file, 'utf8');
      const chuncks = [];

      rs.on('data', (chunk) => {
        chuncks.push(chunk);
      });

      rs.on('end', () => {
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(chuncks.join('\n'));
      });
    } catch (e) {
      sendError(res);
    }
  }
});

async function startServer() {
  try {
    getMethods(transformFilesPath).then((results) => {
      results.forEach((method) => methods.add(method));
    });
    await processingCore.runner(count);
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (e) {
    console.log(e.message);
  }
}

startServer();
