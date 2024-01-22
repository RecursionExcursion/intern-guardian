import * as element from './elements.js'
import * as state from './state-params.js'
import * as dom from './dom.js'
import * as face from './face.js'

export function initalizeCamera() {
    navigator.getUserMedia(
      { video: true },
      (stream) => (element.video.srcObject = stream),
      (err) => console.error(err)
    );
  }

  export async function captureClick() {
    try {
      await captureImage(element.video).then((captured) => {
        state.setCapturedCanvas(captured)
        element.refImage.src = captured.toDataURL();
      });
  
      const faces = await face.createRefImageCanvasOverlay();
      console.log('faces ' + faces);
  
      element.noRefWrapper.classList.add('hidden');
      element.storedImageWrapper.classList.remove('hidden');
      dom.showHide(element.storedImageWrapper, element.noRefWrapper)
  
  
      if (faces === 1) {
        element.saveButton.disabled = false;
        dom.writeToConsoleTA('Image captured');
      } else {
        if (faces === 0) {
          dom.writeToConsoleTA('There must be a face in the image');
        } else {
          dom.writeToConsoleTA('There cannot be more than 1 face in the image');
        }
        element.saveButton.disabled = true;
      }
    } catch (error) {
      console.error('Error during captureClick:', error);
    }
  }

  function captureImage() {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.height = state.refImageHeight;
      canvas.width = state.refImageHeight * state.aspectRatio;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(element.video, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    });
  }