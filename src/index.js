const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require('fs');

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
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true
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


ipcMain.on("open-addface-window", () => {
  popupWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    alwaysOnTop: true,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true
    },
  });

  popupWindow.loadFile(path.join(__dirname, "pages", "addface.html"));
});



ipcMain.on("message", (event, message) => {
  console.log(message)
})

const statePath = path.join(__dirname, "appstate", "user64.json")

ipcMain.on("saveCanvas", (event, canvasData) => {
  saveCanvasDataToMemory(canvasData)
  console.log('Saved')
})

function saveCanvasDataToMemory(canvasData) {
  fs.writeFileSync(statePath, JSON.stringify(canvasData));
}

ipcMain.on('loadCanvasData', (event) => {
console.log('Loading...')


  const loadedCanvasData = loadCanvasDataFromMemory();

  event.reply('canvasDataLoaded', loadedCanvasData);
});

function loadCanvasDataFromMemory() {
  try {
    const rawData = fs.readFileSync(statePath, 'utf8');
    const loadedCanvasData = JSON.parse(rawData);
    return loadedCanvasData;
  } catch (error) {
    console.error('Error loading Canvas data:', error.message);
    return null;
  }
}



