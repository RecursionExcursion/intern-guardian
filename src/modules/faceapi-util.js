//Only needs to be ran one time per runtime
// export function loadAIModels() {
//   return Promise.all([
//     faceapi.nets.tinyFaceDetector.loadFromUri("../models/face-api"),
//     faceapi.nets.faceLandmark68Net.loadFromUri("../models/face-api"),
//     faceapi.nets.faceRecognitionNet.loadFromUri("../models/face-api"),
//     faceapi.nets.faceExpressionNet.loadFromUri("../models/face-api"),
//   ])
// }
// //Only needs to be ran one time per page instance
// export function startVideo(video) {
//   navigator.getUserMedia(
//     { video: true },
//     (stream) => (video.srcObject = stream),
//     (err) => console.error(err)
//   );
// }

// function captureSnapshot() {
//   const canvas = document.createElement("canvas");
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  
//   document.body.appendChild(canvas); // You can display or handle the snapshot as needed
// }

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


// export function mapFaceToCanvas(video, canvas) {
//   const displaySize = { width: canvas.width, height: canvas.height };
//   faceapi.matchDimensions(canvas, displaySize);
  
//   setInterval(async () => {
//     const detections = await captureFaces(video);
//     const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
//     canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
//     faceapi.draw.drawDetections(canvas, resizedDetections);
//     faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
//     faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
//   }, 100);
// }

// async function captureFaces(video) {
//   //detection
//   return await faceapi
//     .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//     .withFaceLandmarks()
//     .withFaceExpressions();
// }