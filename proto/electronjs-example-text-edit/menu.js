const { BrowserWindow, dialog } = require('electron');

// Custom Menus
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
                        if(result.canceled){
                            mainWindow.webContents.send('menu-canceled', result);
                        }else{
                            mainWindow.webContents.send('menu-open-file', result);
                        }
                    }).catch((err) => {
                        // error getting file path
                        mainWindow.webContents.send('menu-error', err);
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
                        if(result.canceled){
                            mainWindow.webContents.send('menu-canceled', result);
                        }else{
                            mainWindow.webContents.send('menu-save-file', result);
                        }
                    }).catch((err) => {
                        // error getting file path
                        mainWindow.webContents.send('menu-error', err);
                    });
                }
            }

        ]
    }
];

module.exports = MainMenuTemplate;
