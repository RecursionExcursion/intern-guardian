Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
    faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
    faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
    faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
    faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
  ]).then(start)


  function start() {
  
  }