// load app and BrowserWindow
const { app, Menu, BrowserWindow } = require('electron')
//-------- ----------
// Custom Menu
//-------- ----------
const isMac = process.platform === 'darwin'
const MenuTemplate = [
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }
]
const menu = Menu.buildFromTemplate(MenuTemplate)
Menu.setApplicationMenu(menu)
//-------- ----------
// Create the browser window.
//-------- ----------
function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {}
  })
  // and load the index.html of the app.
  mainWindow.loadFile('html/index.html')
  // Open the DevTools for debugging
  //mainWindow.webContents.openDevTools()
}
//-------- ----------
// EVENTS
//-------- ----------
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

