'use strict';

const defaultImgElement = document.getElementById('file-img');
const fileElement = document.getElementById('file');
const generateBtn = document.getElementById('generate');
let imageData;

let w, h;

defaultImgElement.onload = function () {
  const canvas = document.createElement('canvas');
  canvas.width = defaultImgElement.width;
  canvas.height = defaultImgElement.height;
  const context = canvas.getContext('2d');
  context.drawImage(defaultImgElement, 0, 0);
  h = canvas.height;
  w = canvas.width;

  const { width, height } = defaultImgElement;
  imageData = context.getImageData(0, 0, width, height);
  generateBtn.disabled = false;
};

const reader = new FileReader();
reader.onload = function (e) {
  const dataURL = e.target.result;
  defaultImgElement.src = dataURL;
}

fileElement.addEventListener('change', e => {
  const file = fileElement.files[0];
  reader.readAsDataURL(file);
})

function imageDataToImg(data) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = w;
  canvas.height = h;
  const imageData = new ImageData(new Uint8ClampedArray(data), w, h);
  ctx.putImageData(imageData, 0, 0);
  defaultImgElement.src = canvas.toDataURL();
}