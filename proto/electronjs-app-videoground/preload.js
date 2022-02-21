// preload with contextIsolation enabled
const { contextBridge, ipcRenderer} = require('electron');
const path = require('path');
const fs = require('fs')

// the api that will be window.videoAPI in the client side code
let videoAPI = {
    filePath: null, //path.join(__dirname, 'html/js/video-start.js')
};

const EVENT = {};

// when a file is opened with file > open
EVENT.menuOpenFile = function(callback){
    ipcRenderer.on('menuOpenFile', function(evnt, result) {
        let filePath = result.filePaths[0];
        if(filePath){
            videoAPI.filePath = filePath;
            callback(evnt, result);
        }else{
            ipcRenderer.send('menuError', new Error('no file path in the result object.') )
        }
    });
};

// when an error happens with a menu option
EVENT.menuError = function(callback){
    ipcRenderer.on('menuError', function(evnt, err) {
        callback(evnt, err);
    });
};

videoAPI.on = function(eventType, callback){
   EVENT[eventType](callback);
};


// create an api for window objects in web pages
contextBridge.exposeInMainWorld('videoAPI', videoAPI);


console.log('preload');