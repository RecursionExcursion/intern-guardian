import * as face from '../modules/faceapi-util.js'

//Capturing DOM elements
const video = document.getElementById("video");
const canvas = document.getElementById("faceCanvas");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const appStatusText = document.getElementById("appStatusText");

//Variables
let faceNotPresentCount = 0;
const faceDectectionTimeInterval = 1000; //ms
let faceDetectionInterval;

let appIsRunning = false;
const appIsRunningString = "App is running";
const appIsNotRunningString = "App is not running";


//Listeners
startButton.addEventListener("click", startFaceDetection);
stopButton.addEventListener("click", stopFaceDetection);

setStatus(appIsNotRunningString);

face.loadAIModels().then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
  face.mapFaceToCanvas(canvas);
}

function startFaceDetection() {
  appIsRunning = true;
  setStatus(appIsRunningString);

  faceDetectionInterval = face.startDetectionInterval(
    faceNotPresentCount,
    faceDectectionTimeInterval,
    stopFaceDetection
  )
}

function stopFaceDetection() {
  clearInterval(faceDetectionInterval);
  appIsRunning = false;
  setStatus(appIsNotRunningString);
}

function setStatus(text) {
  appStatusText.classList.remove("label-green", "label-red");
  if (appIsRunning) {
    appStatusText.classList.add("label-green");
  } else {
    appStatusText.classList.add("label-red");
  }
  appStatusText.textContent = text;
  enableDisableButtons()
}

function enableDisableButtons() {
  if (appIsRunning) {
    startButton.disabled = true;
    stopButton.disabled = false;
  } else {
    startButton.disabled = false;
    stopButton.disabled = true;
  }
}