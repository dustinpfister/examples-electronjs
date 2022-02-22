// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile);

const textAPI = {};

// CLIENT EVENT for open file option in menu
textAPI.onMenuOpenFile = function(callback){
    // should get a result object from main.js
    ipcRenderer.on('menu-open-file', function(evnt, result) {
        const filePath = result.filePaths[0];
        textAPI.getText(filePath)
        .then((text) => {
            callback(evnt, text, result);
        })
        .catch((e) => {
            ipcRenderer.send('menu-error', e);
        });
    });
};
// CLIENT EVENT for save file option in menu
textAPI.onMenuSaveFile = function(callback){
    ipcRenderer.on('menu-save-file', callback);
};
textAPI.getText = function(filePath, callback){
    return readFile(filePath, 'utf8');
};
// save the given text to the given file path
textAPI.saveText = function(text, filePath){
    fs.writeFile(filePath, text, 'utf8', (e) => {
        if(e){
            // if error writing file
            console.log(e.message);
        }
    });
};


// create an api for window objects in web pages
contextBridge.exposeInMainWorld('textAPI', textAPI);


console.log('preload');
