// load app and BrowserWindow
const { app, dialog, Menu, BrowserWindow} = require('electron');
const path = require('path');
//-------- ----------
// HELPER FUNCTIONS
//-------- ----------
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
    mainWindow.loadFile('html/index.html');
    // Open the DevTools for debugging
    mainWindow.webContents.openDevTools();
    const menu = Menu.buildFromTemplate(MainMenuTemplate);
    mainWindow.setMenu(menu);
    return mainWindow;
};
//-------- ----------
// MENU
//-------- ----------
// Custom Menus
const isMac = process.platform === 'darwin';
// The main menu for the main window
const MainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' }: { role: 'quit' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'toggleDevTools' },
            { role: 'togglefullscreen' }
        ]
    }
];
//-------- ----------
// EVENT HANDLERS
//-------- ----------
// the 'window-all-closed' is also a kind of on quit event
app.on('window-all-closed',  () => {
    if (process.platform !== 'darwin'){
        app.quit();
    }
});
//-------- ----------
// WHEN READY
//-------- ----------
app.whenReady().then(() => {
    createMainWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0){
            createMainWindow()
        }
    })
});