'use strict';

module.exports = (data) => {
  const grayscaleCofs = [0.2126, 0.7152, 0.0722];
  const length = data.length;
  for (let i = 0; i < length; i += 4) {
    const pictureColors = data.slice(i, i + 3);

    const val = pictureColors.reduce(
      (acc, color, index) => acc + color * grayscaleCofs[index],
      0
    );

    data[i] = data[i + 1] = data[i + 2] = val;
  }
  return data;
};
