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
        startAnyFaceDetection()
    } else {
        startMyFaceDetection()
    }
}

function stopFaceAI() {
    clearInterval(state.faceDetectionInterval)
    clearInterval(state.videoOverlayInterval)
    clearCanvas(element.videoCanvas)
}

function startAnyFaceDetection() {

    let count = 0

    const displaySize = dom.getDisplaySize(element.videoCanvas)
    faceapi.matchDimensions(element.videoCanvas, displaySize)

    state.setVideoOverlayInterval(setInterval(async () => {

        let videoAIData = await captureFacesWithAI(element.video)

        const faceDetected = videoAIData.length > 0;

        updateVideoOverlay(element.videoCanvas, videoAIData, displaySize)

        count = screenLock(faceDetected, count)

    }, state.intervalTime))
}

async function startMyFaceDetection() {

    let refFaceAIData = await captureFacesWithAI(element.refImage)

    let faceMatcher = new faceapi.FaceMatcher(refFaceAIData);

    let count = 0

    const displaySize = dom.getDisplaySize(element.videoCanvas)
    faceapi.matchDimensions(element.videoCanvas, displaySize)

    state.setVideoOverlayInterval(setInterval(async () => {
        clearCanvas(element.videoCanvas)

        let videoAIData = await captureFacesWithAI(element.video)

        videoAIData = faceapi.resizeResults(videoAIData, displaySize);

        let isPresent = false

        videoAIData.forEach((face) => {
            const { detection, descriptor } = face;

            let label = faceMatcher.findBestMatch(descriptor).toString();

            let options

            if (label.includes("unknown")) {
                // options = { label: "Unknown" };
                return
            } else {
                options = { label: "Me" };
            }
            isPresent = true
            const drawBox = new faceapi.draw.DrawBox(detection.box, options)
            drawBox.draw(element.videoCanvas)
        });

        count = screenLock(isPresent, count)

    }, state.intervalTime));
}

function screenLock(bool, count) {

    if (bool) {
        count = 0;
        window.popup.closePopupWindow();
    } else {
        if (count % 10 == 0) {
            dom.writeToConsoleTA("Face not present, locking screen in " + (40 - count))
        }
        count += 2;
    }

    //Set to 30> when done testing
    if (count == 10) {
        window.popup.openPopupWindow();
    }
    if (count >= 30) {
        window.ipc.lockScreen();
        stopFaceDetection()
    }

    return count
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
    clearCanvas(canvas)
    faceapi.draw.drawDetections(canvas, faceData);
}

function clearCanvas(canvas) {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}