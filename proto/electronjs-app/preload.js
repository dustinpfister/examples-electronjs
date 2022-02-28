// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs'),
promisify = require('util').promisify,
readFile = promisify(fs.readFile),
writeFile = promisify(fs.writeFile);

const demoAPI = {};

demoAPI.getInfo = function(){
    
};


// create an api for window objects in web pages
contextBridge.exposeInMainWorld('demoAPI', demoAPI);
