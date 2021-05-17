'use strict';

module.exports = (data) => {
  for (var i = 0; i < data.length; i += 4) {
    data[i] += 50;
    data[i + 1] += 50;
    data[i + 2] += 50;
  }
  return data;
};
