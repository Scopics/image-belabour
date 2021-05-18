'use strict';

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const processingCore = require('./app/processing-core');
const MIME_TYPES = require('./MIME_TYPES.json')

const PORT = 8000;
const count = os.cpus().length;
const transformFilesPath = './app/transform/';
const api = new Map();
let methods;

const getBaseName = file => path.basename(file, '.js');

async function getMethods(directory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err)
      } else {
        const baseNames = files.map(getBaseName);
        resolve(baseNames);
      }
    })
  })
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

function sendError(res) {
  res.statusCode = 500;
  res.end('Unknown method');
}

const server = http.createServer(async (req, res) => {
  const url = req.url;
  console.log(url);
  const urlSplitted = url.slice(1).split('/');
  const isApi = urlSplitted[0] === 'api';
  if (isApi) {
    const urlMethod = urlSplitted[1];
    const method = api.get(urlMethod);
    if (!method) {
      sendError(res);
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
      sendError(res);
      return;
    }
    const mimeType = MIME_TYPES[fileExt];
    try {
      fs.readFile(file, (err, data) => {
        if (err) {
          sendError(res);
          return;
        }
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
      });
    } catch (e) {
      sendError(res);
      return;
    }
  }
});

async function startServer() {
  methods = await getMethods(transformFilesPath);
  processingCore.runner(count);
  server.listen(PORT);  
}

startServer();