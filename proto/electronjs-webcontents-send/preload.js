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

EVENT.infoOS = function(callback){
    ipcRenderer.on('infoOS', function(evnt) {
        let osInfo = {
            platform: process.platform
        };
        callback(evnt, osInfo);
    });
};
 
API.on = function(eventType, callback){
   EVENT[eventType](callback);
};
 
// create an api for window objects in web pages
contextBridge.exposeInMainWorld('API', API);
