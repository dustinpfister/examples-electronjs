// load app and BrowserWindow
const { app, dialog, Menu, BrowserWindow} = require('electron');
const path = require('path');

// Create the Main browser window.
const createWindow = () => {
    const window = new BrowserWindow({
            width: 800,
            height: 600,
            backgroundColor: '#008888',
            webPreferences: {
                contextIsolation: true,
                preload: path.resolve( __dirname, 'preload.js')
            }
        });
    // load the html file for the main window
    window.loadFile('html/window_main.html');
    // Open the DevTools for debugging
    window.webContents.openDevTools();
    const menu = Menu.buildFromTemplate(MainMenuTemplate);
    window.setMenu(menu);
    return window;
};

// Custom Menus
const isMac = process.platform === 'darwin';
// The main menu for the main window
const MainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            // Open a new window
            {
                label: 'New Window',
                click: () => {
                    createWindow();
                }
            },
            isMac ? { label: 'Close', role: 'close' }: { label: 'Close', role: 'quit' },
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { 
                label: 'Copy',
                click: (evnt, window) => {
                    window.webContents.send('edit_copy');
                }
            },
            { 
                label: 'Paste',
                click: (evnt, window) => {
                    window.webContents.send('edit_paste');
                }
            },
            { 
                label: 'Delete',
                click: (evnt, window) => {
                    window.webContents.send('edit_delete');
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    }
];

// the 'ready' event
app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0){
            createWindow()
        }
    })
});
// the 'window-all-closed' is also a kind of on quit event
app.on('window-all-closed',  () => {
    if (process.platform !== 'darwin')
        app.quit()
});
