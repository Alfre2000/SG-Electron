const fs = require('fs');

const { app, BrowserWindow, ipcMain, desktopCapturer, dialog, Menu } = require('electron');
const isDev = require('electron-is-dev');
const mainMenu = require('./mainMenu');
const createWindow = require('./createWindow');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  const menu = Menu.buildFromTemplate(mainMenu);
  Menu.setApplicationMenu(menu);
  ipcMain.handle('toggle-fullscreen', () => {
    const win = BrowserWindow.getFocusedWindow()
    win.setFullScreen(!win.isFullScreen())  
  })
  ipcMain.handle('save-schreenshot', () => {
    desktopCapturer.getSources({ types: ['window'], thumbnailSize: {width: 1350, height: 800} }).then(sources => {
        const win = BrowserWindow.getFocusedWindow()
        const defaultPath = app.getPath('desktop')
        dialog.showSaveDialog(win, { 
          title: "Salva Schreenshot",
          defaultPath: defaultPath,
          properties: ['openFile', 'openDirectory', 'createDirectory'],
        }).then((file => {
            if (!file.canceled) {
                const path = file.filePath.toString() + '.png'
                fs.writeFile(path, sources[0].thumbnail.toPNG(), function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                })}
        }))
    })
  })
  ipcMain.handle('alerts-manutenzioni', async (event, alerts) => {
    const win = event.sender.getOwnerBrowserWindow()
    let response = null;
    alerts.forEach((operazione) => {
      if (response === null) {
        const btn = dialog.showMessageBoxSync(win, {
          type: "warning",
          title: `Manutenzione necessaria !`,
          message: `É necessario effettuare la seguente manutenzione:\n\n ${operazione.nome}`,
          buttons: ['Ok', 'Effettua']
        })
        if (btn === 1) {
          response = operazione
        }
      }
    })
    return response
  })
  ipcMain.handle('open-admin', () => {
    openAdminSite()
  })
});


function openAdminSite () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000, minWidth: 1000,
    height: 800, minHeight: 500,
    x: 0, y: 0,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      enableRemoteModule: false,
    },
    show: false,
  });
  win.once('ready-to-show', win.show)

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:8000/sg-admin'
      : 'https://supergalvanica.herokuapp.com/sg-admin/'
  );
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});