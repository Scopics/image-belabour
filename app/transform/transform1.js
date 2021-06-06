'use strict';

const brightnessTransofrm = require('./brightness.js');

const testOptions = {
  ajustment: 40,
};

module.exports = brightnessTransofrm.bind(null, testOptions);
