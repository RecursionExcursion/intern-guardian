//Only needs to be ran one time per runtime
export function loadAIModels() {
    return Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("../models/face-api"),
        faceapi.nets.faceLandmark68Net.loadFromUri("../models/face-api"),
        faceapi.nets.faceRecognitionNet.loadFromUri("../models/face-api"),
        faceapi.nets.faceExpressionNet.loadFromUri("../models/face-api"),
    ])
}

export class FaceApiProtoType {
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

    startDetectionInterval(count, time, stopFunction) {
        return setInterval(async () => {

            const detections = await captureFaces(this.video);
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

    mapFaceToCanvas(targetCanvas) {
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