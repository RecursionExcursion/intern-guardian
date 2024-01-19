// Only needs to be ran one time per runtime
export function loadAIModels() {

  const modelPath = './public/models'

  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
    faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
    faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
    faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
  ])
}

//Only needs to be ran one time per page instance
export function startVideo(video) {
  navigator.getUserMedia(
    { video: true },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

function captureSnapshot() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

  document.body.appendChild(canvas); // You can display or handle the snapshot as needed
}

// export function startDetectionInterval(video, count, time, stopFunction) {
//   return setInterval(async () => {

//     const detections = await captureFaces(video)

//     const faceDetected = detections.length > 0;

//     if (faceDetected) {
//       console.log("I see you!");
//       count = 0;
//       window.popup.closePopupWindow();
//     } else {
//       count++;
//       console.log("Face not present " + count + " times");
//     }

//     //Set to 30> when done testing
//     if (count == 10) {
//       //Would love to pass in a var here but electron is an abomination that scorges the earth
//       window.popup.openPopupWindow(/*30*/);
//     }
//     if (count >= 30) {
//       window.ipc.lockScreen();
//       stopFunction();
//       window.popup.closePopupWindow();
//     }
//   }, time);
// }


export function mapFaceToCanvas(video, targetCanvas) {
  window.msg.clogMsg(video.height);
  window.msg.clogMsg(targetCanvas.height);
  console.log(video.height)
  console.log(targetCanvas.height)

  targetCanvas.width = video.width;
  targetCanvas.height = video.height;
  console.log(targetCanvas.height)


  const displaySize = { width: targetCanvas.width, height: targetCanvas.height };
  faceapi.matchDimensions(targetCanvas, displaySize);


  setInterval(async () => {
    const detections = await captureFaces(video);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    targetCanvas.getContext("2d").clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    faceapi.draw.drawDetections(targetCanvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(targetCanvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(targetCanvas, resizedDetections);
  }, 100);
}



function createOffScreenCanvas(video) {
  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = video.videoWidth;
  offscreenCanvas.height = video.videoHeight;
  const offscreenContext = offscreenCanvas.getContext("2d");
  offscreenContext.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
  return offscreenCanvas

  //Need later
  // // Get the image data directly
  // const imageData = offscreenContext.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);

  // return imageData
}

export function startDetectionInterval(video, count, time, stopFunction) {
  return setInterval(async () => {

    const detections = await captureFaces(video);
    const faceDetected = detections.length > 0;

    if (faceDetected) {
      console.log("I see you!");
      count = 0;
      window.popup.closePopupWindow();
    } else {
      count++;
      console.log("Face not present " + count + " times");
    }

    //Set to 30> when done testing
    if (count == 10) {
      //Would love to pass in a var here but electron is an abomination that scorges the earth
      window.popup.openPopupWindow( /*30*/);
    }
    if (count >= 30) {
      window.ipc.lockScreen();
      stopFunction();
      window.popup.closePopupWindow();
    }
  }, time);
}

async function captureFaces(video) {
  //detection
  return await faceapi
    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();
}

export async function facialRecognition(reference) {
  const singleResult = await faceapi
    .detectAllFaces(reference, new faceapi.TinyFaceDetectorOptions())

  if (singleResult) {
    const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
    console.log(bestMatch.toString())
  }
}