// load app and BrowserWindow
const { app, dialog, Menu, BrowserWindow} = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
//******** **********
// CREATE USER DATA FOLDER
//******** **********
const createUserDataFolder = function(){
    let dir_home = os.homedir();
    let dir_userdata = path.join(dir_home, '.userDataApp');
    return new Promise((resolve, reject) => {
        fs.mkdir(dir_userdata, { recursive: true }, (err) => {
            if (err){
                reject(err)
            }else{
                resolve();
            }
        });
    });
};
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
    mainWindow.webContents.openDevTools()
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
                    dialog.showOpenDialog(BrowserWindow.fromId(1), {
                        properties: ['openFile']
                    }).then((result) => {
                        mainWindow.webContents.send('menu-open-file', result);
                    }).catch((err) => {
                        // error getting file path
                    })
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
                        mainWindow.webContents.send('menu-save-file', result);
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
    // create the user data folder if it is not there to begin with
    createUserDataFolder()
    // if all goes well with user data folder
    .then(()=>{
        console.log('user data folder was created, or existed all ready.');
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