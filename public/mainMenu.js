const { BrowserWindow } = require("electron");
const createWindow = require("./createWindow");

const isMac = process.platform === "darwin";

module.exports = [
  ...(isMac
    ? [
        {
          label: "SuperGalvanica",
          submenu: [
            { label: "Informazioni su SuperGalvanica", role: "about" },
            { type: "separator" },
            { label: "Servizi", role: "services" },
            { type: "separator" },
            { label: "Nascondi SuperGalvanica", role: "hide" },
            { label: "Nascondi altre", role: "hideOthers" },
            { label: "Mostra tutte", role: "unhide" },
            { type: "separator" },
            { label: "Esci da SuperGalvanica", role: "quit" },
          ],
        },
      ]
    : []),
  {
    label: "Finestre",
    submenu: [
      { label: "Nuova Finestra", click: () => createWindow() },
      {
        label: "Apri DevTools",
        click: () => {
          const win = BrowserWindow.getFocusedWindow();
          win.webContents.openDevTools({ mode: "detach" });
        },
      },
      { role: "toggleFullScreen" },
    ],
  },
  {
    label: "File",
    submenu: [{ label: "Chiudi applicazione", role: isMac ? "close" : "quit" }],
  },
  {
    label: "Modifica",
    submenu: [
      { label: "Annulla Inserimento", role: "undo" },
      { label: "Ripristina", role: "redo" },
      { type: "separator" },
      { label: "Taglia", role: "cut" },
      { label: "Copia", role: "copy" },
      { label: "Incolla", role: "paste" },
      { label: "Incolla e adegua lo stile", role: "pasteAndMatchStyle" },
      { label: "Elimina", role: "delete" },
      { label: "Seleziona tutto", role: "selectAll" },
    ],
  },
  {
    label: "Vista",
    submenu: [
      { label: "Ricarica", role: "reload" },
      { type: "separator" },
      { label: "Dimensioni reali", role: "resetZoom" },
      { label: "Ingrandisci", role: "zoomIn" },
      { label: "Riduci", role: "zoomOut" },
      { type: "separator" },
      { label: "Attiva modalità a tutto schermo", role: "togglefullscreen" },
    ],
  },
];
