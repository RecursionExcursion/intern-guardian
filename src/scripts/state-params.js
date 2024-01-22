export const intervalTime = 2000; //ms

export let faceDetectionInterval;
export let videoOverlayInterval

export let capturedCanvas;

//False = 'my face' mode
export let anyFaceMode = false
export let hasImage = false

export const videoSoloHeight = 300
export const videoPariedHeight = 200
export const aspectRatio = (4 / 3)

export const refImageHeight = 250

export function setHasImage(bool) {
    hasImage = bool
}

export function updateFaceMode(bool) {
    anyFaceMode = bool
}

export function setCapturedCanvas(canvas) {
    capturedCanvas = canvas
}

export function setFaceDetectionInterval(interval) {
    faceDetectionInterval = interval
}

export function setVideoOverlayInterval(interval) {
    videoOverlayInterval = interval
}