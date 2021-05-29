'use strict';

const brightnessTransofrm = require('./brightness');

const testOptions = {
  ajustment: 30,
};

module.exports = brightnessTransofrm.bind(null, testOptions);
