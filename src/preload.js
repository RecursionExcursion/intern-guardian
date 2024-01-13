// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

function openPopupWindow() {
  ipcRenderer.send("open-popup-window");
}

function closePopupWindow() {
  ipcRenderer.send("close-popup-window");
}

let popUpBridge = {
  openPopupWindow,
  closePopupWindow,
};

contextBridge.exposeInMainWorld("popup", popUpBridge);
contextBridge.exposeInMainWorld('exec', {
  lockScreen: () => {
    ipcRenderer.send('lock-screen');
  },
});
contextBridge.exposeInMainWorld('ipc', {
  lockScreen: () => {
    ipcRenderer.send('lock-screen');
  },
});
