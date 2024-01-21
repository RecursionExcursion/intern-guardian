import * as element from './elements.js'
import * as state from './state-params.js'
import * as dom from './dom.js'
import * as face from './face.js'
import * as camera from './camera.js'
import initializeListeners from './listeners.js'

/* Initalization */
(async () => {
  element.mainContainer.classList.add("disabled-div")
  dom.writeToConsoleTA("Initializing....")

  await face.loadModels();
  initializeListeners();

  camera.initalizeCamera()
  dom.resizeVideoFeed(state.videoSoloHeight)
  element.consoleTextArea.disabled = true;
  element.consoleTextArea.style.resize = 'none';

  dom.setMenuTabToDetection(true)
  dom.toggleModeToAnyFace(true)
  dom.setRunningStatus(false);

  dom.positionCanvasOverlay(element.videoCanvas, element.video)
  
  dom.writeToConsoleTA("Initialization complete")
  element.mainContainer.classList.remove("disabled-div")
})()