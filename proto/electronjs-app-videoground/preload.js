// preload with contextIsolation enabled
const { contextBridge, ipcRenderer} = require('electron');
const path = require('path');

const EVENT = {};

EVENT.menuOpenFile = function(callback){

    ipcRenderer.on('menuOpenFile', function(evnt, result) {

        callback(evnt, result);

    });

}


// create an api for window objects in web pages
contextBridge.exposeInMainWorld('videoAPI', {
    videoFilePath: path.join(__dirname, 'html/js/video-start.js'), 
    on: function(eventType, callback){

        EVENT[eventType](callback);

    }
    
});


console.log('preload');