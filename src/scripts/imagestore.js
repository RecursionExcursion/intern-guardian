const video = document.getElementById("video");

const captureButton = document.getElementById("captureButton");
const saveButton = document.getElementById("saveButton");
const loadButton = document.getElementById("loadButton");

let capturedCanvas;
const capturedimage = document.getElementById("image");
const loadedImage = document.getElementById("loadedImage");


navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => video.srcObject = stream)
  .catch((error) => console.error("Error accessing camera:", error));

captureButton.addEventListener("click", captureClick);
saveButton.addEventListener("click", saveButtonClick);
loadButton.addEventListener("click", loadImage);

function loadImage() {
  window.memory.loadCanvas().then(json => loadedImage.src = json.imageData)
}


function dataURLToCanvas(imageJson) {

  const img = new Image();
  img.src = imageJson.dataURL;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
  };
  return canvas;
}


function saveButtonClick() {
  const canvasData = {
    width: capturedCanvas.width,
    height: capturedCanvas.height,
    imageData: capturedCanvas.toDataURL(), // Get base64 representation of the canvas image
  };
  window.memory.saveCanvas(canvasData);
}

function captureClick() {
  captureImage(video).then((captured) => {
    capturedCanvas = captured;
    // capturedimage.src = canvasToImg(captured).src;
    capturedimage.src = canvasToImg(captured).src;
  });
}


function captureImage() {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    // Draw the video frame onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    resolve(canvas)
  });
}

function canvasToImg(canvas) {
  const image = new Image();
  image.src = canvas.toDataURL();
  return image;
}