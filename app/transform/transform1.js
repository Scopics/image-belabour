'use strict';

module.exports = (data) => {
  for (let i = 0; i < data.length; i += 4) {
    data[i] += 40;
    data[i + 1] += 40;
    data[i + 2] += 40;
  }
  return data;
};
