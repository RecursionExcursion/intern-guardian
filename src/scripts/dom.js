import * as element from './elements.js'
import { silentLoadImage } from './memory.js'
import * as state from './state-params.js'

export function setRunningStatus(isRunning) {
    if (isRunning) {
        writeToConsoleTA("Face Detection Started")
        enableDisable(element.stopButton, element.startButton)
    } else {
        writeToConsoleTA("Face Detection Stopped")
        enableDisable(element.startButton, element.stopButton)
    }
}

export function toggleModeToAnyFace(anyFaceOn) {
    if (anyFaceOn) {
        enableDisable(element.toggleMyFaceButton, element.toggleAnyFaceButton)
        state.updateFaceMode(true)
        writeToConsoleTA("Set to [Any Face]")
    } else {
        if (state.hasImage) {
            enableDisable(element.toggleAnyFaceButton, element.toggleMyFaceButton)
            state.updateFaceMode(false)
            writeToConsoleTA("Set to [My Face]")
        } else {
            writeToConsoleTA("A image from memory must be analyzed first")
        }
    }
}

export function setMenuTabToDetection(isDetectionControlMenu) {
    if (isDetectionControlMenu) {
        showHide(element.startStopWrapper, element.referenceSettingsWrapper)
        enableDisable(element.referenceMenuTab, element.detectionsControlTab)
        enableReferenceImageView(false)
        resizeMedia(element.video, state.videoSoloHeight, state.aspectRatio)
        resizeMedia(element.videoCanvas, state.videoSoloHeight, state.aspectRatio)
        silentLoadImage()
    } else {
        showHide(element.referenceSettingsWrapper, element.startStopWrapper)
        enableDisable(element.detectionsControlTab, element.referenceMenuTab)
        enableReferenceImageView(true)
        resizeMedia(element.video, state.videoPariedHeight, state.aspectRatio)
        resizeMedia(element.videoCanvas, state.videoPariedHeight, state.aspectRatio)
    }
}

export function showHide(showElement, hideElement) {
    hideElement.classList.add('hidden')
    showElement.classList.remove('hidden')
}

export function writeToConsoleTA(message) {
    element.consoleTextArea.value += message + "\n";
    element.consoleTextArea.scrollTop = element.consoleTextArea.scrollHeight
}

export function positionCanvasOverlay(overlay, underlay) {
    overlay.style.left = underlay.offsetLeft;
    overlay.style.top = underlay.offsetTop;
    overlay.height = underlay.height;
    overlay.width = underlay.width;
    overlay.style.position = "absolute";
}

export function getDisplaySize(element) {
    return { width: element.width, height: element.height }
}

export function resizeMedia(media, dimension, aspectRatio) {
    media.height = dimension
    media.width = dimension * aspectRatio
}

function enableReferenceImageView(referenceMenuToggled) {
    if (referenceMenuToggled) {
        element.imageWrapper.classList.remove('hidden')
    } else {
        element.imageWrapper.classList.add('hidden')
    }
}

function enableDisable(enableButton, disableButton) {
    enableButton.disabled = false;
    disableButton.disabled = true;
}

