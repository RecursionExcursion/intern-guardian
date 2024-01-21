import * as element from './elements.js'
import * as face from './face.js'
import * as memory from './memory.js'
import * as dom from './dom.js'
import * as camera from './camera.js'

element.startButton.addEventListener("click", face.startFaceDetection);
element.stopButton.addEventListener("click", face.stopFaceDetection);

element.captureButton.addEventListener("click", camera.captureClick);
element.saveButton.addEventListener("click", memory.saveImage);
element.loadButton.addEventListener("click", memory.loadImage);
element.deleteButton.addEventListener("click", memory.deleteStoredImage);

element.toggleAnyFaceButton.addEventListener("click", () => dom.toggleModeToAnyFace(true))
element.toggleMyFaceButton.addEventListener("click", () => dom.toggleModeToAnyFace(false))

element.detectionsControlTab.addEventListener("click", () => dom.setMenuTabToDetection(true))
element.referenceMenuTab.addEventListener("click", () => dom.setMenuTabToDetection(false))
