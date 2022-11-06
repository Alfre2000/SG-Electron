const { screen, BrowserWindow, Menu } = require("electron");
const updater = require("./updater");
const isDev = require("electron-is-dev");
const path = require("path");
const windowStateKeeper = require("electron-window-state");

const contextMenu = Menu.buildFromTemplate(require("./contextMenu"));

module.exports = function createWindow() {
  // Check for Updates after 4 seconds
  setTimeout(updater, 4000);

  // Get Screen size
  const { width: screenWidth, height: screenHeight } =
    screen.getPrimaryDisplay().bounds;

  let state = windowStateKeeper({
    defaultWidth: screenWidth * 0.9,
    defaultHeight: screenHeight,
  });

  // Create the browser window.
  const win = new BrowserWindow({
    x: state.x,
    y: state.y,
    width: state.width,
    minWidth: 1000,
    height: state.height,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    show: false,
  });

  state.manage(win);

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
  win.webContents.on("context-menu", (e) => {
    contextMenu.popup();
  });
};
