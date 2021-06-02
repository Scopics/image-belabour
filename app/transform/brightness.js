'use strict';

const brightnessTransofrm = (options, data) => {
  const { ajustment } = options;
  for (let i = 0; i < data.length; i++) {
    data[i] += ajustment;
  }
  return Array.from(data);
};

module.exports = brightnessTransofrm;
