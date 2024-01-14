//Rename myfaceApi to something less ambiguous and stupid
import * as faceapi_object from '../modules/faceapi_object.js';

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
addfaceButton.addEventListener("click", toAddFaceView);

let fapi;

function toAddFaceView() {
  // fapi.unloadModels()
  window.view.faceCaptureView();
}

setStatus(appIsNotRunningString);
initalizeFaceApi()
async function initalizeFaceApi() {
  fapi = new faceapi_object.FaceApiObject(video)
  await fapi.loadModels()
  window.msg.clogMsg('Models loaded')
  fapi.startVideo()
  fapi.mapFaceToCanvas(canvas)
}


function startFaceDetection() {
  appIsRunning = true;
  setStatus(appIsRunningString);
  faceDetectionInterval = fapi.startDetectionInterval(
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