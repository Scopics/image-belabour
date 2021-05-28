'use strict';

const brightnessTransofrm = (options, data) => {
  const { pixels, ajustment } = options;
  for (let i = 0; i < data.length; i += pixels) {
    data[i] += ajustment;
    data[i + 1] += ajustment;
    data[i + 2] += ajustment;
  }
  return data;
};

module.exports = brightnessTransofrm;
