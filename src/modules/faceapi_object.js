//Only needs to be ran one time per runtime
export function loadAIModels() {

    const modelPath = './public/models'

    return Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
        faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
        faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
    ])
}

export class FaceApiObject {
    constructor(video) {
        this.video = video;
        this.canvas = createOffScreenCanvas(video);
    }

    getCanvas(){
        return this.canvas;
    }

    startVideo() {
        navigator.getUserMedia(
            { video: true },
            (stream) => (this.video.srcObject = stream),
            (err) => console.error(err)
        );
    }

    

    
}

function createOffScreenCanvas(vid) {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = vid.videoWidth;
    offscreenCanvas.height = vid.videoHeight;
    const offscreenContext = offscreenCanvas.getContext("2d");
    offscreenContext.drawImage(vid, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
    return offscreenCanvas

    //Need later
    // // Get the image data directly
    // const imageData = offscreenContext.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // return imageData
}

async function captureFaces(video) {
    //Returns detection object
    return await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
  }