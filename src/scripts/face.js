import * as dom from './dom.js'
import * as element from './elements.js'
import * as state from './state-params.js'

export async function loadModels() {
    const modelPath = "./models";
    dom.writeToConsoleTA("Loading AI models");
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
        faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
        faceapi.nets.ageGenderNet.loadFromUri(modelPath),
    ]);
    dom.writeToConsoleTA("AI models loaded");
}

export async function createRefImageCanvasOverlay() {

    dom.positionCanvasOverlay(element.refCanvas, element.refImage)

    const displaySize = dom.getDisplaySize(element.refCanvas)

    faceapi.matchDimensions(element.refCanvas, displaySize);

    const imageAIData = await captureFacesWithAI(element.refImage)

    updateVideoOverlay(element.refCanvas, imageAIData, displaySize)

    return imageAIData.length
}

export function startFaceDetection() {
    dom.setRunningStatus(true);
    runFaceAI();
}

export function stopFaceDetection() {
    stopFaceAI()
    dom.setRunningStatus(false);
    window.popup.closePopupWindow();
}


const runFaceAI = async () => {
    if (state.anyFaceMode) {
        startAnyFaceDetection(stopFaceAI)
    } else {
        startMyFaceDetection(stopFaceAI)
    }
}

function stopFaceAI() {
    clearInterval(state.faceDetectionInterval)
    clearInterval(state.videoOverlayInterval)
}

function startAnyFaceDetection(stopFunction) {

    let count = 0
    const displaySize = dom.getDisplaySize(element.videoCanvas)
    faceapi.matchDimensions(element.videoCanvas, displaySize)


    state.setVideoOverlayInterval(setInterval(async () => {

        let videoAIData = await captureFacesWithAI(element.video)

        const faceDetected = videoAIData.length > 0;

        updateVideoOverlay(element.videoCanvas, videoAIData, displaySize)

        if (faceDetected) {
            count = 0;
            window.popup.closePopupWindow();
        } else {
            count++;
            dom.writeToConsoleTA("Face not present, locking screen in " + (40 - (2 * count)))
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
    }, state.intervalTime))
}

async function startMyFaceDetection(stopFunction) {

    //Get stored faceAIData
    let refFaceAIData = await faceapi
        .detectAllFaces(element.refImage)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withAgeAndGender();

    //Logging
    console.log(refFaceAIData);
    window.msg.clogMsg(refFaceAIData);

    //Set up canvas
    const canvas1 = document.getElementById("canvas1");
    canvas1.style.position = "absolute";

    canvas1.style.left = element.refImage.offsetLeft;
    canvas1.style.top = element.refImage.offsetTop;
    canvas1.height = element.refImage.height;
    canvas1.width = element.refImage.width;

    console.log("AI data", refFaceAIData);

    //Logging
    refFaceAIData.forEach(f => {
        console.log(f)
    })

    //Draw results
    refFaceAIData = faceapi.resizeResults(refFaceAIData, element.refImage);
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

function captureFacesWithAI(reference) {
    return faceapi
        .detectAllFaces(reference)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withAgeAndGender();
}

function updateVideoOverlay(canvas, faceData, displaySize) {
    faceData = faceapi.resizeResults(faceData, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, faceData);
}