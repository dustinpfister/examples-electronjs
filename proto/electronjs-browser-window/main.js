// load app and BrowserWindow
const {
    app,
    Menu,
    BrowserWindow
} = require('electron')

    let mainWin;

function createChildWindow() {


    const childWindow = new BrowserWindow({
            //parent: parentWindow,
            width: 320,
            height: 240
        });

    const menu = Menu.buildFromTemplate(ChildMenuTemplate);
    childWindow.setMenu(menu);
	
    childWindow.loadFile('index.html');
	
	
	
    return childWindow;
};

// Create the Main browser window.
function createMainWindow() {
    const mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            backgroundColor: '#008888',
            webPreferences: {}
        });
    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
    // Open the DevTools for debugging
    //mainWindow.webContents.openDevTools()
    // creating a starting child window
    createChildWindow();
    const menu = Menu.buildFromTemplate(MainMenuTemplate);
    mainWindow.setMenu(menu)
    return mainWindow;
};

// Custom Menus
const isMac = process.platform === 'darwin'
    // The main menu for the main window
    const MainMenuTemplate = [{
            label: 'File',
            submenu: [
                isMac ? { role: 'close' }: { role: 'quit' },
                {
                    label: 'New Window',
                    click: function(){
                        createChildWindow();
                    }
                }
            ]
        }, {
            label: 'View',
            submenu: [{
                    type: 'separator'
                }, {
                    role: 'togglefullscreen'
                }
            ]
        }
    ];
// child window

const ChildMenuTemplate = [{
            label: 'View',
            submenu: [{
                    type: 'separator'
                }, {
                    role: 'togglefullscreen'
                }
            ]
        }
    ];

// the 'ready' event

app.whenReady().then(() => {
    mainWin = createMainWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0){
            createMainWindow()
        }
    })
});

/*
app.on('ready', function(){
	
	createMainWindow();
	
});
*/

// the 'window-all-closed' is also a kind of on quit event
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit()
});
