// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile),
writeFile = promisify(fs.writeFile);

const textAPI = {};

// CLIENT EVENT for open file option in menu
textAPI.onMenuOpenFile = function(callback){
    // should get a result object from main.js
    ipcRenderer.on('menu-open-file', function(evnt, result) {
        const filePath = result.filePaths[0];
        textAPI.getText(filePath)
        .then((text) => {
            callback(evnt, text, result);
        });
    });
};
// CLIENT EVENT for save file option in menu
textAPI.onMenuSaveFile = function(callback){
    ipcRenderer.on('menu-save-file', callback);
};
textAPI.onMenuCanceled = function(callback){
    ipcRenderer.on('menu-canceled', callback);
};
textAPI.onMenuError = function(callback){
    ipcRenderer.on('menu-error', callback);
};
// get text at the given file path
textAPI.getText = function(filePath){
    return readFile(filePath, 'utf8')
    .catch((e) => {
        ipcRenderer.send('menu-error', e);
    });
};
// save the given text to the given file path
textAPI.saveText = function(text, filePath){
    return writeFile(filePath, text, 'utf8')
    .catch((e) => {
        ipcRenderer.send('menu-error', e);
    });
};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('textAPI', textAPI);
