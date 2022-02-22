// load app and BrowserWindow
const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');

// Create the Main browser window.
const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            backgroundColor: '#008888',
            webPreferences: {
                contextIsolation: true,
                preload: path.resolve( __dirname, 'preload.js')
            }
        });
    // load the html file for the main window
    mainWindow.loadFile('html/window_main.html');

    // Open the DevTools for debugging
    //mainWindow.webContents.openDevTools()

    const menu = Menu.buildFromTemplate( require( path.join(__dirname, 'menu.js')) );
    mainWindow.setMenu(menu);
    return mainWindow;
};

// the 'ready' event
app.whenReady().then(() => {
    createMainWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0){
            createMainWindow()
        }
    })
});
// the 'window-all-closed' is also a kind of on quit event
app.on('window-all-closed',  () => {
    if (process.platform !== 'darwin')
        app.quit()
});