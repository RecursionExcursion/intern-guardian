const video = document.getElementById("video");

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

function returnHome(){
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

    }else{
      image.src = '../public/smile.jpg'
    }
  })
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

function canvasToImg(canvas) {
  const image = new Image();
  image.src = canvas.toDataURL();
  return image;
}