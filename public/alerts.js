const { ipcMain, BrowserWindow } = require("electron");
const axios = require("axios");
const path = require("path");
const isDev = require("electron-is-dev");
const log = require("electron-log");

const BASE_PATH = isDev ? "http://localhost:8000" : "https://supergalvanica.herokuapp.com";
// const BASE_PATH = "https://supergalvanica.herokuapp.com";

let alertWindow = null;
let lastClose = null;

module.exports = function fetchAlerts() {
  if (BrowserWindow.getAllWindows().length === 0) return;
  let mainWindow = BrowserWindow.getAllWindows()[0];

  mainWindow.webContents.send("get-user");
  ipcMain.once("send-user", (event, user) => {
    let url = `${BASE_PATH}/analisi-manutenzioni/richieste-correzione-bagno?eseguita=false`;
    const impianto = user?.user?.impianto;
    log.info(user?.key, impianto);
    if (!user?.key || !impianto) return;
    url += `&impianto=${impianto.id}`;
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user.key}`,
        },
      })
      .then((response) => {
        log.info(response.data.results);
        if (response.data.results.length > 0) {
          if (alertWindow) {
            alertWindow.show();
            return;
          }
          // if the last close was less than 20 minutes ago, don't open the window
          if (lastClose && new Date() - lastClose < 20 * 60 * 1000) return;
          log.info("Creating alert window");
          alertWindow = new BrowserWindow({
            width: 600,
            minWidth: 600,
            height: 200,
            minHeight: 200,
            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false,
              enableRemoteModule: true,
            },
            show: false,
          });
          alertWindow.once("ready-to-show", () => {
            alertWindow.show();
            setTimeout(() => {
              alertWindow.webContents.send("go-to-page", "/manutenzione/alert-richieste/");
            }, 100);
          });

          setTimeout(() => {
            alertWindow.loadURL(pageUrl);
          }, 1000);

          const pageUrl = isDev
            ? "http://localhost:3000"
            : `file:///${path.join(__dirname, "../build/index.html").replace(/\\/g, "/")}`;

          alertWindow.on("close", () => {
            alertWindow = null;
            lastClose = new Date();
          });
        } else {
          if (alertWindow) {
            alertWindow.close();
            alertWindow = null;
          }
        }
      })
      .catch((error) => {
        log.error(error);
        console.error(error);
      });
  });
};
