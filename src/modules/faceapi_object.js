//Only needs to be ran one time per runtime
function loadAIModels() {
    const modelPath = './public/models/'
    return Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),

        faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
        faceapi.nets.tinyYolov2.loadFromUri(modelPath),

        faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(modelPath),

        faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
        faceapi.nets.faceExpressionNet.loadFromUri(modelPath),

        faceapi.nets.ageGenderNet.loadFromUri(modelPath),
    ])
}

function unloadAIModels() {
    return Promise.all([
        faceapi.nets.ssdMobilenetv1.unloadModel(),

        faceapi.nets.tinyFaceDetector.unloadModel(),
        faceapi.nets.tinyYolov2.loadFromUri("../models/face-api"),

        faceapi.nets.faceLandmark68Net.unloadModel(),
        faceapi.nets.faceLandmark68TinyNet.unloadModel(),

        faceapi.nets.faceRecognitionNet.unloadModel(),
        faceapi.nets.faceExpressionNet.unloadModel(),

        faceapi.nets.ageGenderNet.unloadModel(),
    ])
}

export class FaceApiObject {
    constructor(video) {
        this.video = video;
        this.canvas = createOffScreenCanvas(video);
    }

    async loadModels() {
        await loadAIModels();
    } 
    
    async unloadModels() {
        await unloadAIModels();
    }

    getCanvas() {
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

    async compareFacesToOverlay(image) {
        const detections = await detectFacesOnImage(image);

        // Draw the results on the overlay canvas
        const canvas = faceapi.createCanvasFromMedia(overlay);
        // document.body.append(canvas);
        const displaySize = { width: overlay.width, height: overlay.height };

        faceapi.matchDimensions(canvas, displaySize);

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        // Process the results and draw the comparison information
        resizedDetections.forEach(detection => {
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

            const text = `Name: ${bestMatch.label} | Distance: ${bestMatch.distance.toFixed(2)}`;
            const drawBox = new faceapi.draw.DrawTextField([text], detection.detection.box.bottomLeft);

            drawBox.draw(canvas);
        })
    };
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
        .detectAllFaces(video, await  new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
}

async function detectFacesOnImage(image) {
    return new Promise(async (resolve) => {
        const results = await faceapi
            .detectAllFaces(image)
            .withFaceLandmarks()
            .withFaceDescriptors()
        resolve(results)
    })
}


