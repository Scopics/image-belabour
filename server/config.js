'use strict';

const os = require('os');

const count = os.cpus().length;
const PORT = process.env.PORT || 8000;

module.exports = { count, PORT };
