const { dialog } = require("electron")
const { autoUpdater } = require("electron-updater")

// Logging for debug
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"

autoUpdater.autoDownload = false

module.exports = () => {
    autoUpdater.checkForUpdates()
    autoUpdater.on('update-available', () => {
        dialog.showMessageBox({
            type: 'info',
            title: "Aggiornamento disponibile",
            messagge: "Una nuova versione del programma è disponibile. Vuoi installarla ora ?",
            buttons: ['Aggiorna', 'No']
        }).then(result => {
            // if (result.response === 0) {
            //      autoUpdater.downloadUpdate()
            // }
            autoUpdater.downloadUpdate()
        })  
    })
    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            type: "info",
            title: "Aggiornamento pronto",
            message: "Vuoi aggiornare il programma e riavviarlo ora ?",
            buttons: ['Si', 'Più tardi']
        }).then(result => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall(false, true)
           }
        })
    })
}