// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile),
writeFile = promisify(fs.writeFile);

const demoAPI = {};

// when info is ready event hander
demoAPI.onInfoReady = (callback) => {
    ipcRenderer.on('info-ready', callback);
};

// get info
demoAPI.getInfo = () => {
    ipcRenderer.send('info-request');
};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('demoAPI', demoAPI);
