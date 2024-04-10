const { ipcMain, BrowserWindow } = require("electron");
const axios = require("axios");
const path = require("path");
const isDev = require("electron-is-dev");

const BASE_PATH =
  process.env.NODE_ENV === "production" ? "https://supergalvanica.herokuapp.com" : "http://localhost:8000";

let alertWindow = null;

module.exports = function fetchAlerts() {
  let mainWindow = BrowserWindow.getAllWindows()[0];

  mainWindow.webContents.send("get-user");
  ipcMain.once("send-user", (event, user) => {
    let url = `${BASE_PATH}/analisi-manutenzioni/richieste-correzione-bagno?eseguita=false`;
    const impianto = user?.user?.impianto;
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
        if (response.data.results.length > 0) {
          if (alertWindow) {
            alertWindow.show();
            return; 
          }
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
          alertWindow.once("ready-to-show", alertWindow.show);

          const pageUrl = isDev
            ? "http://localhost:3000/#/manutenzione/alert-richieste/"
            : `file://${path.join(__dirname, "../build/index.html#/manutenzione/alert-richieste/")}`;

          alertWindow.loadURL(pageUrl);

          alertWindow.on("closed", () => {
            // Per 30 minuti dopo la chiusura della finestra, non mostrare più alert
            setTimeout(() => {
              alertWindow = null;
            }, 1000 * 60 * 30); // 30 minuti
          });
        } else {
          if (alertWindow) {
            alertWindow.close();
            alertWindow = null;
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
};
