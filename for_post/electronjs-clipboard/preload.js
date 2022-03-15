// preload with contextIsolation enabled
const { contextBridge, ipcRenderer} = require('electron');
const path = require('path');
const fs = require('fs')

const cbDemoAPI = {};

const EVENT = {};

EVENT.actionPaste = function(callback){
    ipcRenderer.on('actionPaste', function(evnt, text) {
        callback(evnt, text);
    });
};

cbDemoAPI.on = function(eventType, callback){
   EVENT[eventType](callback);
};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('cbDemoAPI', cbDemoAPI);
