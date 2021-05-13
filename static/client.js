'use strict';

const getCanvas = (w, h) => {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;

  return canvas;
};

window.onload = function () {
  const img = new Image();
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);

    const data = context.getImageData(0, 0, img.width, img.height);

    console.log(data);
  };

  img.src = './assets/example.jpg';
};
