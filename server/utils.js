const fs = require('fs');
const path = require('path');

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

module.exports = {
  getMethods,
  getArgs,
  sendError
}