// load app and BrowserWindow
const { app, Menu, BrowserWindow } = require('electron')

let mainWin;

function createChildWindow (parentWindow) {
    const childWindow = new BrowserWindow({
        parent: parentWindow, width: 320, height: 240
    });
    childWindow.loadFile('index.html');
    return childWindow;
};

// Create the Main browser window.
function createMainWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#008888',
    webPreferences: {}
  })
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  // Open the DevTools for debugging
  //mainWindow.webContents.openDevTools()
  
  createChildWindow(mainWindow);
  
  // creating and showing a child window
  //const child = new BrowserWindow({ parent: mainWindow, width: 320, height: 240 });
  //child.show();
  //mainWindow.show();
  
  
  return mainWindow;
};



// Custom Menu
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
const menu = Menu.buildFromTemplate(MenuTemplate);
Menu.setApplicationMenu(menu);

// the 'ready' event
app.whenReady().then(() => {
  mainWin = createMainWindow();
  //const child = new BrowserWindow({ parent: mainWin });
  //child.show();
  //mainWin.show();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// the 'window-all-closed' is also a kind of on quit event
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

