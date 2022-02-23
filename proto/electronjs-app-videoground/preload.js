// preload with contextIsolation enabled
const { contextBridge, ipcRenderer} = require('electron');
const path = require('path');
const fs = require('fs')

// the api that will be window.videoAPI in the client side code
let videoAPI = {};

// the events object
const EVENT = {};

// export to images
EVENT.menuExport = function(callback){
    ipcRenderer.on('menuExport', function(evnt, result, mode) {
        let imageFolder = result.filePaths[0];
        console.log('we are getting this far at least');
        callback(evnt, result, imageFolder, mode);
    });
};

// when a file is opened with file > open
EVENT.menuOpenFile = function(callback){
    ipcRenderer.on('menuOpenFile', function(evnt, result) {
        let filePath = result.filePaths[0];
        if(filePath){
            // read the file and set it to the client
            fs.readFile(filePath, 'utf8', (e, text) => {
                if(e){
                    ipcRenderer.send('menuError', e);
                }else{
                    callback(evnt, text, result);
                }
            });
        }else{
            ipcRenderer.send('menuError', new Error('no file path in the result object.') );
        }
    });
};

// when an error happens with a menu option
EVENT.menuError = function(callback){
    ipcRenderer.on('menuError', function(evnt, err) {
        callback(evnt, err);
    });
};

// The main on method to attach events
videoAPI.on = function(eventType, callback){
   EVENT[eventType](callback);
};

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('videoAPI', videoAPI);
