'use strict';

const brightnessTransofrm = require('./brightness.js');

const testOptions = {
  ajustment: 30,
};

module.exports = brightnessTransofrm.bind(null, testOptions);
