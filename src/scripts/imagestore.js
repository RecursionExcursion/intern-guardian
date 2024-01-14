import * as faceapi_object from '../modules/faceapi_object.js';

const video = document.getElementById("video");
const overlay = document.getElementById("overlay");

const captureButton = document.getElementById("captureButton");
const saveButton = document.getElementById("saveButton");
const loadButton = document.getElementById("loadButton");
const compareButton = document.getElementById("compareButton");
const homeButton = document.getElementById("homeButton");

let capturedCanvas;
const image = document.getElementById("image");

loadImage();

navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => video.srcObject = stream)
  .catch((error) => console.error("Error accessing camera:", error));

captureButton.addEventListener("click", captureClick);
saveButton.addEventListener("click", saveButtonClick);
loadButton.addEventListener("click", loadImage);
compareButton.addEventListener("click", loadImage);
homeButton.addEventListener("click", returnHome);

function returnHome() {
  window.view.homeView();
}

function loadImage() {
  window.memory.loadCanvas().then(json => {
    if (json) {
      const w = json.width
      const h = json.height

      image.src = json.imageData
      image.width = w
      image.height = h

      startFaceDetection()
    } else {
      image.src = '../public/images/smile.jpg'
    }
  })
}

async function startFaceDetection() {
  const fapi = new faceapi_object.FaceApiObject(video)
  // fapi.startVideo()
  fapi.mapFaceToCanvas(overlay)
  // overlay.hidden = false;
  // // await fapi.compareFacesToOverlay(image)
}

function saveButtonClick() {
  const canvasData = {
    width: capturedCanvas.width,
    height: capturedCanvas.height,
    imageData: capturedCanvas.toDataURL(),
  };
  window.memory.saveCanvas(canvasData);
}

function captureClick() {
  captureImage(video).then((captured) => {
    capturedCanvas = captured;
    image.src = captured.toDataURL();
  });
}

function captureImage() {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    resolve(canvas)
  });
}