// preload with contextIsolation enabled
const { contextBridge, ipcRenderer} = require('electron');
const path = require('path');
const fs = require('fs')


let api = {
    videoFilePath: path.join(__dirname, 'html/js/video-start.js')
};

const EVENT = {};

EVENT.menuOpenFile = function(callback){

    ipcRenderer.on('menuOpenFile', function(evnt, result) {

        callback(evnt, result);

    });
};

api.on = function(eventType, callback){
   EVENT[eventType](callback);
}


// create an api for window objects in web pages
contextBridge.exposeInMainWorld('videoAPI', api);


console.log('preload');