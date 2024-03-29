const fs = require('fs');
const path = require('path');
const http = require('http');

const { app, BrowserWindow, ipcMain, desktopCapturer, dialog, Menu } = require('electron');
const isDev = require('electron-is-dev');
const mainMenu = require('./mainMenu');
const createWindow = require('./createWindow');
const JSZip = require('jszip');

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
  ipcMain.handle('get-query', async (event, queryFileName) => {
      const BASE_PATH = path.join(__dirname, '..', 'src', 'api', 'queries');
      const queryFilePath = path.join(BASE_PATH, queryFileName);
      const queryContent = fs.readFileSync(queryFilePath, 'utf8');
      return queryContent;
  });
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
  ipcMain.handle('save-img', (_, link) => {
    const win = BrowserWindow.getFocusedWindow()
    const fileName = link.split('/')[link.split('/').length - 1]
    const defaultPath = app.getPath('desktop') + '/' + fileName
    dialog.showSaveDialog(win, { 
      title: "Salva Schreenshot",
      defaultPath: defaultPath,
      properties: ['openFile', 'openDirectory', 'createDirectory'],
    }).then((path => {
        if (!path.canceled) {
          const file = fs.createWriteStream(path.filePath.toString());
          http.get(link, response => {
            response.pipe(file)
          });
        }
    }))
  })
  ipcMain.handle('save-certificato', (_, file, defaultName) => {
    const win = BrowserWindow.getFocusedWindow()
    const defaultPath = app.getPath('desktop') + '/' + defaultName
    dialog.showSaveDialog(win, { 
      title: "Salva Certificato",
      defaultPath: defaultPath,
      properties: ['openFile', 'openDirectory', 'createDirectory'],
    }).then((path => {
      if (!path.canceled) {
        fs.writeFile(path.filePath.toString(), file, (err) => {
          if (err) throw err;
          console.log('It\'s saved!');
        })
      }
  }))
  })
  ipcMain.handle('save-pdf', (event, data, defaultName) => {
    const win = BrowserWindow.getFocusedWindow()
    const defaultPath = app.getPath('desktop') + '/' + defaultName
    dialog.showSaveDialog(win, { 
      title: "Salva Documento",
      defaultPath: defaultPath,
      properties: ['openFile', 'openDirectory', 'createDirectory'],
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    }).then((result => {
      if (!result.canceled && result.filePath) {
        fs.writeFile(result.filePath, data, (error) => {
          if (error) {
            console.error('Error saving PDF:', error);
          } else {
            console.error('PDF saved correctly:');
          }
        });
      }
  }))
  })
  ipcMain.handle('print-pdf', (event, data) => {
    const pdfBuffer = Buffer.from(data, 'binary');
    const tempFilePath = app.getPath('desktop') + '/verifica_prezzi.pdf';
    fs.writeFileSync(tempFilePath, pdfBuffer);
    console.log('PDF written to', tempFilePath);
    const printWin = new BrowserWindow({ show: false });
    printWin.loadURL(`file://${tempFilePath}`).then(() => {
      printWin.webContents.print({}, (success, failureReason) => {
        if (!success) console.log('Printing failed', failureReason);
        else console.log('Printed successfully');
        // Optionally, delete the temp file after printing
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error('Failed to delete temporary PDF file', err);
        });
        printWin.close();
      });
    });
  })
  ipcMain.handle('save-zip', (_, file, defaultName) => {
    const win = BrowserWindow.getFocusedWindow()
    const defaultPath = app.getPath('desktop') + '/' + defaultName
    dialog.showSaveDialog(win, { 
      title: "Salva Documenti",
      defaultPath: defaultPath,
      properties: ['openFile', 'openDirectory', 'createDirectory'],
    }).then((path => {
      if (!path.canceled) {
        JSZip.loadAsync(file).then(zip => {
          const basePath = path.filePath.toString();
          fs.mkdir(basePath, { recursive: true }, (err) => {
            if (err) throw err;
            // Iterate over each file in the zip archive
            Object.keys(zip.files).forEach(filename => {
              // Extract the file and save it to disk
              console.log(filename);
              zip.files[filename].async('nodebuffer').then(content => {
                const dirname = filename.split('/').slice(0, filename.split('/').length - 1).join('')
                const fileBasePath = `${basePath}/${dirname}`;
                fs.mkdir(fileBasePath, { recursive: true }, (err) => {
                  if (err) throw err;
                  fs.writeFile(`${basePath}/${filename}`, content, err => {
                    if (err) {
                      console.error(`Error saving file ${filename}: ${err}`);
                    } else {
                      console.log(`File ${filename} saved successfully.`);
                    }
                  });
                });
              });
            });
          });
        }).catch(err => {
          console.error(`Error extracting zip file: ${err}`);
        });
      }
  }))
  })
  ipcMain.handle('open-file', (_, link, sidebar=true) => {
    const win = new BrowserWindow({
      width: 700, minWidth: 700,
      height: 800, minHeight: 500,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: false,
        enableRemoteModule: false,
      },
      show: false,
    });
    win.once('ready-to-show', win.show)
    if (sidebar) {
      win.loadURL(link)
    } else {
      win.loadURL(link + '#toolbar=0&navpanes=0')
    }
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