const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true
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

let popupWindow;

ipcMain.on("open-popup-window", () => {
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
});

ipcMain.on("close-popup-window", () => {
  if (popupWindow) {
    popupWindow.close();
    popupWindow = null;
  }
});
