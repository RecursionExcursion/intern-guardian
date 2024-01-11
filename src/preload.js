// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  openPopupWindow: (time) => {
    ipcRenderer.send("open-popup-window", time);
  },
  closePopupWindow: function () {
    ipcRenderer.send("close-popup-window");
  },
});
