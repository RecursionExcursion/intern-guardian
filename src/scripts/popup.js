const { BrowserWindow } = require("electron");

let popupWindow;

function createPopupWindow() {
  popupWindow = new BrowserWindow({
    width: 400,
    height: 200,
    show: true,
    maximizable: false,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  popupWindow.loadFile(path.join(__dirname, "pages", "popup.html"));
}

function closePopupWindow() {
  if (popupWindow) {
    popupWindow.close();
    popupWindow = null;
  }
}

module.exports = { createPopupWindow, closePopupWindow };
