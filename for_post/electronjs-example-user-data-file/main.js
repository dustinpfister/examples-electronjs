// load app and BrowserWindow
const { app, dialog, Menu, BrowserWindow} = require('electron');
const path = require('path');
// using user-data.js module for main.js and preload.js
const userData = require(path.join(__dirname, 'user-data.js'));
//******** **********
// CREATE MAIN WINDOW FUNCTION
//******** **********
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
    // menu
    const menu = Menu.buildFromTemplate(MainMenuTemplate);
    mainWindow.setMenu(menu)
    return mainWindow;
};
//******** **********
// MENU
//******** **********
const isMac = process.platform === 'darwin';
// The main menu for the main window
const MainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' }: { role: 'quit' },
            // OPEN A FILE
            {
                label: 'Open',
                click: () => {

                    const mainWindow = BrowserWindow.fromId(1);
                    // get user data, and use current value for
                    // dir_open_start as defaultPath for showOpenDialog
                    userData.get()
                    .then((uDat)=>{
                        return dialog.showOpenDialog(BrowserWindow.fromId(1), {
                            defaultPath: uDat.dir_open_start,
                            properties: ['openFile']
                        })
                    })
                   .then((result) => {
                        // only fire fileOpen event for renderer if not canceled
                        if(!result.canceled){
                            mainWindow.webContents.send('fileOpen', result);
                        }
                    }).catch((err) => {
                        // error
                        console.warn(err.message);
                    });

                }
            },
            // SAVE A FILE
            {
                label: 'Save As',
                click: () => {
                    const mainWindow = BrowserWindow.fromId(1);
                    dialog.showSaveDialog(BrowserWindow.fromId(1), {
                        properties: ['showHiddenFiles']
                    }).then((result) => {
                        // only fire fileSave event for renderer if not canceled
                        if(!result.canceled){
                            mainWindow.webContents.send('fileSave', result);
                        }
                    }).catch((err) => {
                        // error getting file path
                    });
                }
            }
        ]
    }
];
//******** **********
// APP EVENTS
//******** **********
// the 'ready' event
app.whenReady().then(() => {
    // do a create check of the user data folder
    userData.create()
    .then(()=>{
        console.log('ready to create the main window now, and start the rest of the app.');
        createMainWindow();
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0){
                createMainWindow()
            }
        });
    })
    // something weird happened creating user data folder in home folder
    .catch((e)=>{
        // not sure what to handle, can do the usual log to standard error at least though
        console.warn(e.message);
    });
});
// the 'window-all-closed' is also a kind of on quit event
app.on('window-all-closed',  () => {
    if (process.platform !== 'darwin')
        app.quit()
});