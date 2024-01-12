const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("lock-screen", () => {
  require("./scripts/lockscreen.js")();
});

ipcMain.on("open-popup-window", (time) => {
  // Code to open the popup window
  createPopupWindow(time);
});

let popupWindow;

ipcMain.on("close-popup-window", () => {
  // Code to close the popup window
  if (popupWindow) {
    popupWindow.close();
    popupWindow = null;
  }
});

function createPopupWindow(time) {
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

  // popupWindow.webContents.on("did-finish-load", () => {
  //   popupWindow.webContents.send("set-time", time);
  // });
}
