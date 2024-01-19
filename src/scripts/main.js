//Rename myfaceApi to something less ambiguous and stupid
import * as faceFacade from "../scripts/faceapi-facade.js";

/*
  DOM elements
*/
//Main Div
const video = document.getElementById("video");
const overlayCanvas = document.getElementById("overlayCanvas");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const appStatusText = document.getElementById("appStatusText");
const gif = document.getElementById("bannerGif");

const captureButton = document.getElementById("captureButton");
const saveButton = document.getElementById("saveButton");
const loadButton = document.getElementById("loadButton");
const compareButton = document.getElementById("compareButton");

const refImage = document.getElementById("image1");

const statusLabel = document.getElementById("statusLabel");
const consoleTextArea = document.getElementById("console");

/*
  Variables
*/
let faceNotPresentCount = 0;
const faceDectectionTimeInterval = 1000; //ms
let faceDetectionInterval;

let appIsRunning = false;
const appIsRunningString = "App is running";
const appIsNotRunningString = "App is not running";

let capturedCanvas;

/*
  Listeners
*/
//Main Div
startButton.addEventListener("click", startFaceDetection);
stopButton.addEventListener("click", stopFaceDetection);

//AddFaceDiv
captureButton.addEventListener("click", captureClick);
saveButton.addEventListener("click", saveButtonClick);
loadButton.addEventListener("click", loadImage);
// compareButton.addEventListener("click", facialRecognition);

/*
  Initalization
*/

function initalization() {
  writeToConsoleTA("Initializing....")

  navigator.getUserMedia(
    { video: true },
    (stream) => (video.srcObject = stream),
    (err) => consoleTextArea.error(err)
  );
  const dim = 200;
  video.width = dim;
  video.height = dim;
  setStatus(appIsNotRunningString);
  gif.src = "./public/images/givemeyourface.gif";
  loadImage();
  consoleTextArea.disabled = true;

  writeToConsoleTA("Initialization complete")
}

initalization();

// faceFacade.loadAIModels().then(
//   faceFacade.mapFaceToCanvas(video, overlayCanvas)
// )

/*
  Functions
*/
//DOM Manipulation
function enableDisableButtons() {
  if (appIsRunning) {
    startButton.disabled = true;
    stopButton.disabled = false;
  } else {
    startButton.disabled = false;
    stopButton.disabled = true;
  }
}

function setStatus(text) {
  appStatusText.classList.remove("label-green", "label-red");
  if (appIsRunning) {
    appStatusText.classList.add("label-green");
  } else {
    appStatusText.classList.add("label-red");
  }
  appStatusText.textContent = text;
  enableDisableButtons();
}

function loadImage() {
  window.memory.loadCanvas().then((json) => {
    if (json) {
      const w = json.width;
      const h = json.height;

      refImage.src = json.imageData;
      refImage.width = w;
      refImage.height = h;
      writeToConsoleTA("Image loaded from memory")
    } else {
      refImage.src = "./public/images/smile.jpg";
    }
  });
  saveButton.disabled = true;
}

// function dataURLToCanvas(imageJson) {
//   const img = new Image();
//   img.src = imageJson.dataURL;
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');
//   img.onload = () => {
//     canvas.width = img.width;
//     canvas.height = img.height;
//     ctx.drawImage(img, 0, 0, img.width, img.height);
//   };
//   return canvas;
// }

function saveButtonClick() {
  const canvasData = {
    width: capturedCanvas.width,
    height: capturedCanvas.height,
    imageData: capturedCanvas.toDataURL(),
  };
  window.memory.saveCanvas(canvasData);
  writeToConsoleTA('Image Saved')
  saveButton.disabled = true;
}

function captureClick() {
  captureImage(video).then((captured) => {
    capturedCanvas = captured;
    refImage.src = captured.toDataURL();
  });
  saveButton.disabled = false;
}

function captureImage() {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    resolve(canvas);
  });
}

// function canvasToImg(canvas) {
//   const image = new Image();
//   image.src = canvas.toDataURL();
//   return image;
// }

// function facialRecognition() {
//   faceFacade.facialRecognition(image)
// }

// Promise.all([
//   faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//   faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//   faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
// ]).then(start)

//FaceAPI
function startFaceDetection() {
  appIsRunning = true;
  setStatus(appIsRunningString);
  // faceDetectionInterval = foo.startDetectionInterval(
  //   faceNotPresentCount,
  //   faceDectectionTimeInterval,
  //   stopFaceDetection
  // );
  writeToConsoleTA("Face detection started")

}

function stopFaceDetection() {
  clearInterval(faceDetectionInterval);
  appIsRunning = false;
  setStatus(appIsNotRunningString);
  window.popup.closePopupWindow();
  writeToConsoleTA("Face detection ended")
}

async function loadModels() {
  const modelPath = "./models";
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
    faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
    faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
    faceapi.nets.ageGenderNet.loadFromUri(modelPath),
  ]);
}

const run = async () => {

  writeToConsoleTA("Loading AI models");
  await loadModels();
  writeToConsoleTA("AI Models loaded");

  //Set up FaceApi
  let refFaceAIData = await faceapi
    .detectAllFaces(refImage)
    .withFaceLandmarks()
    .withFaceDescriptors()
    .withAgeAndGender();

  console.log(refFaceAIData);
  window.msg.clogMsg(refFaceAIData);

  //Set up canvas
  const canvas1 = document.getElementById("canvas1");
  canvas1.style.position = "absolute";

  canvas1.style.left = refImage.offsetLeft;
  canvas1.style.top = refImage.offsetTop;
  canvas1.height = refImage.height;
  canvas1.width = refImage.width;

  console.log("AI data", refFaceAIData);


  refFaceAIData.forEach(f=>{
    console.log(f)
  })

  //Draw results
  refFaceAIData = faceapi.resizeResults(refFaceAIData, refImage);
  faceapi.draw.drawDetections(canvas1, refFaceAIData);

  //Face matching
  let faceMatcher = new faceapi.FaceMatcher(refFaceAIData);

  setInterval(async () => {
    const snapshot = new Image();

    console.log("Snapshot taken");

    //capture Image from video
    captureImage(video).then((captured) => {
      capturedCanvas = captured;
      snapshot.src = captured.toDataURL();
    });

    let snapshotAIData = await faceapi
      .detectAllFaces(snapshot)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withAgeAndGender();

    snapshotAIData = faceapi.resizeResults(snapshotAIData, snapshot);

    snapshotAIData.forEach((face) => {
      const { detection, descriptor } = face;

      let label = faceMatcher.findBestMatch(descriptor).toString();

      let options = { label: "Me" };

      console.log(label);
    });
  }, 5000);
};

run();

function writeToConsoleTA(message) {
  consoleTextArea.value += message + "\n";
}
