const { contextBridge, ipcRenderer} = require('electron');
const path = require('path');
const API = {};
const EVENT = {};
 
EVENT.infoPkg = function(callback){
    ipcRenderer.on('infoPkg', function(evnt) {
        let pkgObj = require(path.join(__dirname, 'package.json'));
        callback(evnt, pkgObj);
    });
};
 
API.on = function(eventType, callback){
   EVENT[eventType](callback);
};
 
// create an api for window objects in web pages
contextBridge.exposeInMainWorld('API', API);
