const { screen, BrowserWindow } = require("electron");
const updater = require("./updater");
const isDev = require("electron-is-dev");
const path = require("path");

module.exports = function createWindow() {
  // Check for Updates after 8 seconds
  setTimeout(updater, 8000);

  // Get Screen size
  const { width: screenWidth, height: screenHeight } =
    screen.getPrimaryDisplay().bounds;

  // Create the browser window.
  const win = new BrowserWindow({
    width: screenWidth * 0.9,
    minWidth: 1000,
    height: screenHeight,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    show: false,
  });

  win.once("ready-to-show", win.show);

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
};
