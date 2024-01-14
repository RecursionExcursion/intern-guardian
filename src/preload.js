// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

function openAddFaceWindow() {
  ipcRenderer.send("open-addface-window");
}


function openPopupWindow() {
  ipcRenderer.send("open-popup-window");
}

function closePopupWindow() {
  ipcRenderer.send("close-popup-window");
}

let popUpBridge = {
  openAddFaceWindow,
  openPopupWindow,
  closePopupWindow,
};

contextBridge.exposeInMainWorld("popup", popUpBridge);

contextBridge.exposeInMainWorld('ipc', {
  lockScreen: () => {
    ipcRenderer.send('lock-screen');
  },
});

contextBridge.exposeInMainWorld('msg', {
  clogMsg: (message) => {
    ipcRenderer.send('message', message);
  },
});

contextBridge.exposeInMainWorld('memory', {
  saveCanvas: (data) => {
    ipcRenderer.send('saveCanvas', data);
  },
  loadCanvas: () => {
    return new Promise((resolve) => {
      ipcRenderer.once('canvasDataLoaded', (event, data) => {
        resolve(data);
      });
      ipcRenderer.once('canvasDataLoadError', (event, errorMessage) => {
        reject(new Error(errorMessage));
      });

      ipcRenderer.send("loadCanvasData")
    });
  }
});