'use strict';

const grayscaleCofs = {
  red: 0.2126,
  green: 0.7152,
  blue: 0.0722,
};
const PIXEL_DATA_LEN = 4;

module.exports = (data) => {
  const length = data.length;
  for (let i = 0; i < length; i += PIXEL_DATA_LEN) {
    const pictureColors = data.slice(i, i + PIXEL_DATA_LEN);

    const val = Object.values(grayscaleCofs).reduce(
      (acc, color, index) => acc + color * pictureColors[index],
      0
    );

    const rIndex = i;
    const gIndex = i + 1;
    const bIndex = i + 2;

    data[rIndex] = data[gIndex] = data[bIndex] = val;
  }
  return Array.from(data);
};
