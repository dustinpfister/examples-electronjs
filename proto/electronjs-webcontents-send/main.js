// load app and BrowserWindow
const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');

// Custom Menu
const isMac = process.platform === 'darwin'
const MenuTemplate = [
    {
        label: 'Info',
        submenu: [
            {
                label: 'Package Info',
                click: () => {
                    // get ref to browser window one way or another
                    const mainWindow = BrowserWindow.fromId(1);
                    
                    // send for event
                    mainWindow.webContents.send('infoPkg');
                    
                }
            }
        ]
    }
]
const menu = Menu.buildFromTemplate(MenuTemplate)
Menu.setApplicationMenu(menu)

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
  mainWindow.loadFile('index.html')
  // Open the DevTools for debugging
  mainWindow.webContents.openDevTools()

  const menu = Menu.buildFromTemplate(MainMenuTemplate);
  mainWindow.setMenu(menu)

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

