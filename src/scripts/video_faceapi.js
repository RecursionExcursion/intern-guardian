//Capturing DOM elements
const video = document.getElementById("video");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const canvas = document.getElementById("faceCanvas");

let faceNotPresentCount = 0;
const faceDectectionTimeInterval = 1000; //ms
let faceDetectionInterval;

startButton.addEventListener("click", startFaceDetection);
stopButton.addEventListener("click", stopFaceDetection);

//Load AI models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("../models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("../models"),
  faceapi.nets.faceExpressionNet.loadFromUri("../models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
  mapFaceToCanvas();
}

function mapFaceToCanvas() {
  const displaySize = { width: canvas.width, height: canvas.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
}

function startFaceDetection() {
  faceDetectionInterval = setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    const faceDetected = detections.length > 0;

    if (faceDetected) {
      console.log("I see you!");
      faceNotPresentCount = 0;

      //close pop up if open
      window.electron.closePopupWindow();
    } else {
      faceNotPresentCount++;
      console.log("Face not present " + faceNotPresentCount + " times");
    }

    //Set to 30> when done testing
    if (faceNotPresentCount == 10) {
      //Would love to pass in a var here but electron is an abomination that scorges the earth with convoluted process
      window.electron.openPopupWindow(/*30*/);
    }
    if (faceNotPresentCount >= 60) {
      window.api.lockScreen();

      stopFaceDetection();
    }

    console.log('Application Started')
  }, faceDectectionTimeInterval);
}

function stopFaceDetection() {
  clearInterval(faceDetectionInterval);
  console.log("Application Stopped");
}
