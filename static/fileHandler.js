'use strict';

const defaultImgElement = document.getElementById('file-img');
const fileElement = document.getElementById('file');
const generateBtn = document.getElementById('generate');

const state = {
  imageData: null,
  width: 0,
  height: 0,
};

defaultImgElement.onload = function () {
  const canvas = document.createElement('canvas');
  const { width, height } = defaultImgElement;
  Object.assign(state, { width, height });
  Object.assign(canvas, { width, height });
  const context = canvas.getContext('2d');
  context.drawImage(defaultImgElement, 0, 0);

  state.imageData = context.getImageData(0, 0, width, height);
  generateBtn.disabled = false;
};

const reader = new FileReader();
reader.onload = function (e) {
  const dataURL = e.target.result;
  defaultImgElement.src = dataURL;
};

fileElement.addEventListener('change', (e) => {
  const file = fileElement.files[0];
  reader.readAsDataURL(file);
});

function imageDataToImg(data) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const { width, height } = state;
  Object.assign(canvas, { width, height });
  const imageData = new ImageData(new Uint8ClampedArray(data), width, height);
  ctx.putImageData(imageData, 0, 0);
  defaultImgElement.src = canvas.toDataURL();
}
