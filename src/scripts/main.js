/*
DOM elements
*/

//Main Div
const video = document.getElementById("video");
const videoCanvas = document.getElementById("videoOverlayCanvas");

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const appStatusText = document.getElementById("appStatusText");
const bannerGif = document.getElementById("bannerGif");

const captureButton = document.getElementById("captureButton");
const saveButton = document.getElementById("saveButton");
const loadButton = document.getElementById("loadButton");
const deleteButton = document.getElementById("deleteButton");

const toggleAnyFaceButton = document.getElementById("toggleAnyFaceButton");
const toggleMyFaceButton = document.getElementById("toggleMyFaceButton");

const detectionsControlTab = document.getElementById("detectionsControlTab");
const referenceMenuTab = document.getElementById("referenceMenuTab");
const startStopWrapper = document.getElementById("startStopWrapper");
const referenceSettingsWrapper = document.getElementById("referenceSettingsWrapper");

const noRefWrapper = document.getElementById("noRefWrapper");
const storedImageWrapper = document.getElementById("storedImageWrapper");

const refImage = document.getElementById("refImage");
const refCanvas = document.getElementById("refCanvas");

const statusLabel = document.getElementById("statusLabel");
const consoleTextArea = document.getElementById("console");


const videoWrapper = document.getElementById("video-wrapper");
const imageWrapper = document.getElementById("image-wrapper");


/*
Variables
*/
let faceNotPresentCount = 0;
const intervalTime = 2000; //ms
let faceDetectionInterval;
let videoOverlayInterval

let capturedCanvas;

//False = 'my face' mode
let anyFaceMode = false
let hasImage = false


/*
Listeners
*/
startButton.addEventListener("click", startFaceDetection);
stopButton.addEventListener("click", stopFaceDetection);

captureButton.addEventListener("click", captureClick);
saveButton.addEventListener("click", saveButtonClick);
loadButton.addEventListener("click", loadImage);
deleteButton.addEventListener("click", deleteStoredImage);

toggleAnyFaceButton.addEventListener("click", () => toggleModeToAnyFace(true))
toggleMyFaceButton.addEventListener("click", () => toggleModeToAnyFace(false))

detectionsControlTab.addEventListener("click", () => setMenuTabToDetection(true))
referenceMenuTab.addEventListener("click", () => setMenuTabToDetection(false))

/*
Initalization
*/
async function initalize() {
  writeToConsoleTA("Initializing....")

  startButton.disabled = true
  consoleTextArea.disabled = true;

  setMenuTabToDetection(true)
  toggleModeToAnyFace(true)
  setRunningStatus(false);
  // imageLoaded(false)

  initalizeCamera()

  const dim = 200;
  video.width = dim;
  video.height = dim;

  await loadModels();
  startButton.disabled = false

  positionCanvasOverlay(videoCanvas, video)

  loadImage();
  writeToConsoleTA("Initialization complete")
}

function initalizeCamera() {
  navigator.getUserMedia(
    { video: true },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}


initalize();


/*
  Functions
*/
//DOM Manipulation
function setRunningStatus(isRunning) {
  if (isRunning) {
    writeToConsoleTA("Face Detection Started")
    enableDisable(stopButton, startButton)
  } else {
    writeToConsoleTA("Face Detection Stopped")
    enableDisable(startButton, stopButton)
  }
}

function enableReferenceImageView(referenceMenuToggled) {
  if (referenceMenuToggled) {
    imageWrapper.classList.remove('hidden')
  } else {
    imageWrapper.classList.add('hidden')
  }
}

function loadImage() {
  window.memory.loadCanvas().then((json) => {
    if (json) {
      const w = json.width;
      const h = json.height;

      refImage.src = json.imageData;
      refImage.width = w;
      refImage.height = h;
      hasImage = true
      writeToConsoleTA("Image retrieved from memory")
      createRefImageCanvasOverlay()

      hasImage = true
      writeToConsoleTA("Image from memory analyzed")

      deleteButton.disabled = false
      showHide(storedImageWrapper, noRefWrapper)

    } else {
      writeToConsoleTA("No image saved")
      deleteButton.disabled = true
      showHide(noRefWrapper, storedImageWrapper)
    }
  });
  saveButton.disabled = true;
}

function writeToConsoleTA(message) {
  consoleTextArea.value += message + "\n";
  consoleTextArea.scrollTop = consoleTextArea.scrollHeight
}

function toggleModeToAnyFace(anyFaceOn) {
  if (anyFaceOn) {
    toggleAnyFaceButton.disabled = true
    toggleMyFaceButton.disabled = false
    anyFaceMode = true
    writeToConsoleTA("Set to [Any Face]")
  } else {
    if (hasImage) {
      toggleAnyFaceButton.disabled = false
      toggleMyFaceButton.disabled = true
      anyFaceMode = false
      writeToConsoleTA("Set to [My Face]")
    } else {
      writeToConsoleTA("A image from memory must be analyzed first")
    }
  }
}

function saveButtonClick() {
  const canvasData = {
    width: capturedCanvas.width,
    height: capturedCanvas.height,
    imageData: capturedCanvas.toDataURL(),
  };
  window.memory.saveCanvas(canvasData);
  writeToConsoleTA('Image Saved')
  saveButton.disabled = true;
  deleteButton.disabled = false
}

async function captureClick() {
  try {
    await captureImage(video).then((captured) => {
      capturedCanvas = captured;
      refImage.src = captured.toDataURL();
    });



    const faces = await createRefImageCanvasOverlay();
    console.log('faces ' + faces);

    noRefWrapper.classList.add('hidden');
    storedImageWrapper.classList.remove('hidden');
    showHide(storedImageWrapper, noRefWrapper)


    if (faces === 1) {
      saveButton.disabled = false;
      writeToConsoleTA('Image captured');
    } else {
      if (faces === 0) {
        writeToConsoleTA('There must be a face in the image');
      } else {
        writeToConsoleTA('There cannot be more than 1 face in the image');
      }
      saveButton.disabled = true;
    }
  } catch (error) {
    console.error('Error during captureClick:', error);
  }
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

//FaceAPI
function startFaceDetection() {
  setRunningStatus(true);
  runFaceAI();
}

function stopFaceDetection() {
  stopInterval()
  setRunningStatus(false);
  window.popup.closePopupWindow();
}

async function loadModels() {
  const modelPath = "./models";
  writeToConsoleTA("Loading AI models");
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
    faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
    faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
    faceapi.nets.ageGenderNet.loadFromUri(modelPath),
  ]);
  writeToConsoleTA("AI models loaded");
}

function stopInterval() {
  clearInterval(faceDetectionInterval)
  clearInterval(videoOverlayInterval)
}

const runFaceAI = async () => {
  if (anyFaceMode) {
    startAnyFaceDetection()
  } else {
    startMyFaceDetection()
  }
}

function saveSettingsState() {

}

function loadSettingsState() {

}

function startAnyFaceDetection() {

  let count = 0
  const displaySize = getDisplaySize(videoCanvas)
  faceapi.matchDimensions(videoCanvas, displaySize)

  faceDetectionInterval = setInterval(async () => {

    let videoAIData = await captureFacesWithAI(video)

    const faceDetected = videoAIData.length > 0;

    updateVideoOverlay(videoCanvas, videoAIData, displaySize)

    if (faceDetected) {
      count = 0;
      window.popup.closePopupWindow();
    } else {
      count++;
      writeToConsoleTA("Face not present, locking screen in " + (40 - (2 * count)))
    }

    //Set to 30> when done testing
    if (count == 10) {
      window.popup.openPopupWindow();
    }
    if (count >= 30) {
      window.ipc.lockScreen();
      stopFunction();
      window.popup.closePopupWindow();
    }
  }, intervalTime);
}

async function startMyFaceDetection() {

  //Get stored faceAIData
  let refFaceAIData = await faceapi
    .detectAllFaces(refImage)
    .withFaceLandmarks()
    .withFaceDescriptors()
    .withAgeAndGender();

  //Logging
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

  //Logging
  refFaceAIData.forEach(f => {
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
}


function updateVideoOverlay(canvas, faceData, displaySize) {
  faceData = faceapi.resizeResults(faceData, displaySize);
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  faceapi.draw.drawDetections(canvas, faceData);
}


function captureFacesWithAI(reference) {
  return faceapi
    .detectAllFaces(reference)
    .withFaceLandmarks()
    .withFaceDescriptors()
    .withAgeAndGender();
}

function setMenuTabToDetection(isDetectionControlMenu) {
  if (isDetectionControlMenu) {
    showHide(startStopWrapper, referenceSettingsWrapper)
    enableDisable(referenceMenuTab, detectionsControlTab)
    enableReferenceImageView(false)
  } else {
    showHide(referenceSettingsWrapper, startStopWrapper)
    enableDisable(detectionsControlTab, referenceMenuTab)
    enableReferenceImageView(true)
  }
}

async function createRefImageCanvasOverlay() {

  positionCanvasOverlay(refCanvas, refImage)

  const displaySize = getDisplaySize(refCanvas)

  faceapi.matchDimensions(refCanvas, displaySize);

  const imageAIData = await captureFacesWithAI(refImage)

  updateVideoOverlay(refCanvas, imageAIData, displaySize)

  console.dir("i-data", imageAIData)

  return imageAIData.length
}

function getDisplaySize(element) {
  return { width: element.width, height: element.height }
}

function positionCanvasOverlay(overlay, underlay) {
  overlay.style.left = underlay.offsetLeft;
  overlay.style.top = underlay.offsetTop;
  overlay.height = underlay.height;
  overlay.width = underlay.width;
  overlay.style.position = "absolute";
}

// function imageLoaded(imageLoaded) {
//   if (imageLoaded) {
//     showHide(imageWrapper, noRefWrapper)
//   } else {
//     showHide(noRefWrapper, imageWrapper)
//   }
// }

function showHide(showElement, hideElement) {
  hideElement.classList.add('hidden')
  showElement.classList.remove('hidden')
}

function enableDisable(enableButton, disableButton) {
  enableButton.disabled = false;
  disableButton.disabled = true;
}

function deleteStoredImage() {
  window.memory.deleteStoredData()
  showHide(noRefWrapper, storedImageWrapper)
  writeToConsoleTA("Image emptied")
}