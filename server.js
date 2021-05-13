'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const STATIC_PATH = path.join(process.cwd(), './static');

const MIME_TYPES = {
  html: 'text/html; charset=UTF-8',
  js: 'application/javascript; charset=UTF-8',
  css: 'text/css',
  png: 'image/png',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

const streamFile = (name) => {
  const filePath = path.join(STATIC_PATH, name);
  if (!filePath.startsWith(STATIC_PATH)) {
    return null;
  }
  const stream = fs.createReadStream(filePath);
  return stream;
};

http
  .createServer(async (req, res) => {
    const { url } = req;
    const name = url === '/' ? '/index.html' : url;
    const fileExt = path.extname(name).substring(1);
    const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
    res.writeHead(200, { 'Content-Type': mimeType });
    console.log(name);
    if (name !== '/favicon.ico') {
      const stream = streamFile(name);
      if (stream) stream.pipe(res);
    }
  })
  .listen(8000);
