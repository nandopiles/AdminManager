const { app, BrowserWindow } = require('electron')
require('@electron/remote/main').initialize()

function createWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    require("@electron/remote/main").enable(win.webContents)
    win.loadFile('login.html')
    win.setMenu(null)

    win.webContents.openDevTools()
}
app.on('ready', createWindow)