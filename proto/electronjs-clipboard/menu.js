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
                    
                }
            }
        ]
    }
];

module.exports = MainMenuTemplate;
