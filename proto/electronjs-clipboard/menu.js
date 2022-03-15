// load app and BrowserWindow
const { app, Menu, BrowserWindow, dialog } = require('electron');
const path = require('path');

// Custom Menus
const isMac = process.platform === 'darwin';
const pkg = require( path.join(__dirname, 'package.json') );
// The main menu for the main window
const MainMenuTemplate = [
    {
        label: 'Edit',
        submenu: [
            isMac ? { role: 'close' }: { role: 'quit' },
            {
                label: 'Paste',
                click: function(){

// ref to window
const mainWindow = BrowserWindow.fromId(1);

// send
mainWindow.webContents.send('actionPaste', 'foo');                

    
                }
            }
        ]
    }
];

module.exports = MainMenuTemplate;
