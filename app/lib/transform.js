'use strict';

module.exports = (data) => {
  for (var i = 0; i < data.length; i += 4) {
    data[i] += 30;
    data[i + 1] += 30;
    data[i + 2] += 30;
  }
  return data;
};