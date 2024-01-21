import * as element from './elements.js'
import * as state from './state-params.js'
import * as dom from './dom.js'
import * as face from './face.js'
import * as camera from './camera.js'
import * as memory from './memory.js'
import initializeListeners from './listeners.js'

/* Initalization */
(async () => {
  dom.writeToConsoleTA("Initializing....")

  initializeListeners();

  element.startButton.disabled = true
  element.consoleTextArea.disabled = true;

  dom.setMenuTabToDetection(true)
  dom.toggleModeToAnyFace(true)
  dom.setRunningStatus(false);

  camera.initalizeCamera()

  dom.resizeVideoFeed(state.videoSoloHeight)

  await face.loadModels();

  element.startButton.disabled = false

  dom.positionCanvasOverlay(element.videoCanvas, element.video)

  memory.loadImage();
  dom.writeToConsoleTA("Initialization complete")
})()