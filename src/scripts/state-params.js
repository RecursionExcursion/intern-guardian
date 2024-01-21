export const intervalTime = 2000; //ms

export let faceDetectionInterval;
export let videoOverlayInterval

export let capturedCanvas;

//False = 'my face' mode
export let anyFaceMode = false
export let hasImage = false


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