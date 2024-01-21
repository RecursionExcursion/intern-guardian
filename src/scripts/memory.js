import * as dom from './dom.js'
import * as state from './state-params.js'
import * as element from './elements.js'
import * as face from './face.js'

export function loadImage() {
  window.memory.loadCanvas().then((json) => {
    if (json) {
      let w = json.width;
      let h = json.height;

      const ratio = w / h;
      h = 250;
      w = ratio * h;

      element.refImage.src = json.imageData;
      element.refImage.width = w;
      element.refImage.height = h;
      state.setHasImage(true);
      dom.writeToConsoleTA("Image retrieved from memory")
      face.createRefImageCanvasOverlay()

      state.setHasImage(true)

      dom.writeToConsoleTA("Image from memory analyzed")

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
  dom.writeToConsoleTA("Image emptied")
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