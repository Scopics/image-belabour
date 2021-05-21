'use strict';

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const processingCore = require('./app/processing-core');
const {
  getMethods,
  getArgs,
  sendError
} = require('./server/utils');
const MIME_TYPES = require('./MIME_TYPES.json');

const PORT = 8000;
const count = os.cpus().length;
const transformFilesPath = './app/transform/';
const methods = new Set();

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

    const stream = fs.createReadStream(file, 'utf8');
    if (stream) {
      res.writeHead(200, { 'Content-Type': mimeType });
      stream.pipe(res);
    } else {
      sendError(res, 404, 'Not found');
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
