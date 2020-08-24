const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');
const fs = require('fs');
const windowStateKeeper = require('electron-window-state');

let mainWindow;
let mainWindowState;


app.allowRendererProcessReuse = true;

app.on('ready', () => {
    //Main Window
    mainWindowState = windowStateKeeper({
        maximize: false
    });

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        },
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        frame: false,
        backgroundColor: '#191919'
    });
    mainWindow.loadFile(`${__dirname}/main.html`);

    //Main Window State
    mainWindowState.manage(mainWindow);
});


ipcMain.on('get-file-path', () => {
    let filePath = app.getPath('home') + '/AppData/Local/Remnant/Saved/SaveGames';

    let gameSaves = fs.readdirSync(filePath, (err, files) => {
        return files;
    });
    mainWindow.webContents.send('file-path', [filePath, gameSaves]);
})

ipcMain.on('choose-save', (e, payload) => {
    fs.readFile(payload, 'utf-8', (err, data) => {
        mainWindow.webContents.send('file-update', data);
    });
})


ipcMain.on('minimize-window', function () {
    mainWindow.minimize();
});

ipcMain.on('maximize-window', function () {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});

ipcMain.on('close-main-window', function () {
    mainWindow.close();
});