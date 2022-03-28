// load app, Menu, and BrowserWindow
const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');

// custom menu
const isMac = process.platform === 'darwin'
const template = [
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  }
];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

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
  mainWindow.webContents.openDevTools()
}

// the 'ready' event
app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// the 'window-all-closed' is also a kind of on quit event
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

