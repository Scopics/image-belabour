module.exports = (data) => {
  const grayscaleCofs = [0.2126, 0.7152, 0.0722];

  for (let i = 0; i < length; i += 4) {
    const pictureColors = data.slice(i, i + 3);

    var val = pictureColors
      .map((color, index) => color * grayscaleCofs[index]);
    
    data[i] = data[i + 1] = data[i + 2] = val;
  }
  return data;
};
      