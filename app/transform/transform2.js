'use strict';

module.exports = (data) => {
  for (let i = 0; i < data.length; i += 3) {
    data[i] += 50;
    data[i + 1] += 50;
    data[i + 2] += 50;
  }
  return data;
};
