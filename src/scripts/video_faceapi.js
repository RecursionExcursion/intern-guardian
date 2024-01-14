//Rename myfaceApi to something less ambiguous and stupid
import * as ProtoFaceApi from '../modules/proto-facepi.js';

//Capturing DOM elements
const video = document.getElementById("video");
const canvas = document.getElementById("faceCanvas");

const startButton = document.getElementById("startButton");
const addfaceButton = document.getElementById("addfaceButton");
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
addfaceButton.addEventListener("click", addFace);

function addFace() {
  window.popup.openAddFaceWindow()
}

setStatus(appIsNotRunningString);

ProtoFaceApi.loadAIModels()
const foo = new ProtoFaceApi.FaceApiProtoType(video)
foo.startVideo()
foo.mapFaceToCanvas(canvas)


function startFaceDetection() {
  appIsRunning = true;
  setStatus(appIsRunningString);
  faceDetectionInterval = foo.startDetectionInterval(
    faceNotPresentCount, faceDectectionTimeInterval, stopFaceDetection
  )
}

function stopFaceDetection() {
  clearInterval(faceDetectionInterval);
  appIsRunning = false;
  setStatus(appIsNotRunningString);
  window.popup.closePopupWindow();
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