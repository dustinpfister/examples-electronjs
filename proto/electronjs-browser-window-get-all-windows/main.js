// load app, Menu, and BrowserWindow
const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');

// custom menu
const isMac = process.platform === 'darwin'
const template = [
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' },
      {
          label: 'New Window',
          click: function(){
  createWindow();
          }
       }
    ]
  }
];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

function createWindowsEventHandler (eventType, forWindow) {
    return function() {
      // get a collection of all windows
      var windows = BrowserWindow.getAllWindows();
      // create custom object with relevant info for each window such as id
      var windowObjects = windows.map((win)=>{
          return {
              id: win.id
          };
      });
      // for each window object
      windows.forEach((win, i) => {
          let fwObj = {
              id: forWindow.id
          };
          win.webContents.send(eventType, fwObj, windowObjects[i], windowObjects);
      });
  };
};

// Create the browser window.
function createWindow () {
  const newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        contextIsolation: true,
        preload: path.resolve( __dirname, 'preload.js')
    }
  });
  // and load the index.html of the app.
  newWindow.loadFile('index.html');
  // Open the DevTools for debugging
  //newWindow.webContents.openDevTools();
  
  // on ready to show event call windowCreate method for all windows
  newWindow.on('ready-to-show', createWindowsEventHandler('windowCreate', newWindow) );
  newWindow.on('close', createWindowsEventHandler('windowClose', newWindow) );
  /*
  newWindow.on('ready-to-show', ()=>{
      // get a collection of all windows
      var windows = BrowserWindow.getAllWindows();
      // create custom object with relevant info for each window such as id
      var windowObjects = windows.map((win)=>{
          return {
              id: win.id
          };
      });
      // for each window object
      windows.forEach((win, i) => {
          win.webContents.send('windowCreate', {
              id: newWindow.id
          }, windowObjects[i], windowObjects);
      });
  });
  */
  
};

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

