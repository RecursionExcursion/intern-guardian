// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("popup", {
  closePopupWindow: () => {
    ipcRenderer.send("close-popup-window")
  },
  openPopupWindow: () => {
    ipcRenderer.send("open-popup-window");
  }
});

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
  },
  deleteStoredData: () => {
    ipcRenderer.send('deleteData')
  }
});

contextBridge.exposeInMainWorld('view', {
  homeView: () => {
    ipcRenderer.send("load-view", "/index")
  },
  faceCaptureView: () => {
    ipcRenderer.send("load-view", "/pages/addface")
  }
})