'use strict';

const http = require('http');
const path = require('path');
const {
  getMethods,
  sendError,
  sendFile,
  processImage,
} = require('./server/utils');
const processingCore = require('./app/processing-core');
const { count, PORT } = require('./server/config');

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
      const processedImage = await processImage(req, method);
      const concatedImageData = [].concat(...processedImage);
      res.end(JSON.stringify(concatedImageData));
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
    const fileName = isMethod ? '/index.html' : url;
    const file = path.join(__dirname, './static', fileName);
    sendFile(res, file, fileExt);
  }
});

async function startServer() {
  try {
    const transformFilesFullPath = path.join(__dirname, transformFilesPath);
    getMethods(transformFilesFullPath).then((results) => {
      results.forEach((method) => methods.add(method));
    });

    const pids = await processingCore.runner(count);

    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
      console.log(`The processes are running with the following pid: ${pids}`)
    });
  } catch (e) {
    console.log(e.message);
  }
}

startServer();
