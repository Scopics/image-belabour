'use strict';

const brightnessTransofrm = require('./brightness');

const testOptions = {
  ajustment: 30,
  pixels: 3,
};

module.exports = brightnessTransofrm.bind(null, testOptions);
