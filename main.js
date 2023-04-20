const { app, BrowserWindow } = require('electron')
require('@electron/remote/main').initialize()

function createWindow() {
    let win = new BrowserWindow({
        icon: "img/PrincipalIcon.png",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.once('ready-to-show', () => {
        win.maximize();
    });
    require("@electron/remote/main").enable(win.webContents)
    win.loadFile('login.html')
    win.setMenu(null)

    win.webContents.openDevTools()
}
app.on('ready', createWindow)