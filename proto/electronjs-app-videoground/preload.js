// preload with contextIsolation enabled
const { contextBridge, ipcRenderer} = require('electron');
const path = require('path');
const fs = require('fs')

// the api that will be window.videoAPI in the client side code
let videoAPI = {
    filePath: path.join(__dirname, 'html/js/video-start.js')
};

const EVENT = {};

EVENT.menuOpenFile = function(callback){

    ipcRenderer.on('menuOpenFile', function(evnt, result) {

        callback(evnt, result);

    });
};

videoAPI.on = function(eventType, callback){
   EVENT[eventType](callback);
}


// create an api for window objects in web pages
contextBridge.exposeInMainWorld('videoAPI', videoAPI);


console.log('preload');