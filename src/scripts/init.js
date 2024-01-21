import * as element from './elements.js'
import * as dom from './dom.js'
import * as face from './face.js'
import * as camera from './camera.js'
import * as memory from './memory.js'

/* Initalization */
(async () => {
  dom.writeToConsoleTA("Initializing....")

  element.startButton.disabled = true
  element.consoleTextArea.disabled = true;

  dom.setMenuTabToDetection(true)
  dom.toggleModeToAnyFace(true)
  dom.setRunningStatus(false);

  camera.initalizeCamera()

  const dim = 200;
  element.video.width = dim;
  element.video.height = dim;

  await face.loadModels();

  element.startButton.disabled = false

  dom.positionCanvasOverlay(element.videoCanvas, element.video)

  memory.loadImage();
  dom.writeToConsoleTA("Initialization complete")
})()