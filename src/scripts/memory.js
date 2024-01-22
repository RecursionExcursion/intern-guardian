import * as dom from './dom.js'
import * as state from './state-params.js'
import * as element from './elements.js'
import * as face from './face.js'

export function loadImage() {
  window.memory.loadCanvas().then((json) => {
    if (json) {
      dom.writeToConsoleTA("Image retrieved from memory")
      state.setHasImage(true)
      
      element.refImage.src = json.imageData;
      element.refImage.height = state.refImageHeight;
      element.refImage.width = state.refImageHeight * state.aspectRatio;
      
      face.createRefImageCanvasOverlay()
      dom.writeToConsoleTA("Image analyzed")

      element.deleteButton.disabled = false
      dom.showHide(element.storedImageWrapper, element.noRefWrapper)

    } else {
      state.setHasImage(false)
      dom.writeToConsoleTA("No image saved")
      element.deleteButton.disabled = true
      dom.showHide(element.noRefWrapper, element.storedImageWrapper)
    }
  });
  element.saveButton.disabled = true;
}

export function deleteStoredImage() {
  window.memory.deleteStoredData()
  dom.showHide(element.noRefWrapper, element.storedImageWrapper)
  dom.writeToConsoleTA("Image folder emptied")
}

export function saveImage() {
  const canvasData = {
    width: state.capturedCanvas.width,
    height: state.capturedCanvas.height,
    imageData: state.capturedCanvas.toDataURL(),
  };
  window.memory.saveCanvas(canvasData);
  dom.writeToConsoleTA('Image Saved')
  element.saveButton.disabled = true;
  element.deleteButton.disabled = false
  state.setHasImage(true)
}

export function silentLoadImage() {
  window.memory.loadCanvas().then((json) => {
    if (json) {
      state.setHasImage(true)
      
      element.refImage.src = json.imageData;
      element.refImage.height = state.refImageHeight;
      element.refImage.width = state.refImageHeight * state.aspectRatio;
      
      face.createRefImageCanvasOverlay()

      element.deleteButton.disabled = false
      dom.showHide(element.storedImageWrapper, element.noRefWrapper)

    } else {
      state.setHasImage(false)
      element.deleteButton.disabled = true
      dom.showHide(element.noRefWrapper, element.storedImageWrapper)
    }
  });
  element.saveButton.disabled = true;
}