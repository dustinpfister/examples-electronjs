// load app and BrowserWindow
const { app, BrowserWindow, ipcMain } = require('electron'),
path = require('path');

// Create the browser window.
function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload: path.resolve( __dirname, 'preload.js')
        }
    });
    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // Open the DevTools for debugging
    mainWindow.webContents.openDevTools();

    // for an 'info-request' event
    ipcMain.on('info-request', () => {
        mainWindow.webContents.send('info-ready', {
           dir_docs: app.getPath('documents'),
           dir_app: __dirname
        });
    });

};

// the 'ready' event
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// the 'window-all-closed' is also a kind of on quit event
app.on('window-all-closed',  () => {
  if (process.platform !== 'darwin') app.quit()
});

