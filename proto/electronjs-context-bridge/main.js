// load app and BrowserWindow
const { app, dialog, Menu, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');

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
    mainWindow.webContents.openDevTools()

    const menu = Menu.buildFromTemplate(MainMenuTemplate);
    mainWindow.setMenu(menu)
    return mainWindow;
};

// Custom Menus
const isMac = process.platform === 'darwin';
// The main menu for the main window
const MainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' }: { role: 'quit' },
            {
                label: 'Open',
                click: () => {
                    const mainWindow = BrowserWindow.fromId(1);
                    dialog.showOpenDialog(BrowserWindow.fromId(1), {
                        properties: ['openFile']
                    }).then((result) => {

                        const filePath = result.filePaths[0];
                        fs.readFile(filePath, 'utf8', (err, text) => {

                            if(err){
                                // error reading file
                            }else{

                                mainWindow.webContents.send('menu-open-file', text, result);
                            }

                        });

                    }).catch((err) => {
                        // error getting file path
                    })
                }
            }
        ]
    }
];

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