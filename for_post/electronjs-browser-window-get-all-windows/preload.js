const { contextBridge, ipcRenderer} = require('electron');

// the API to be used in client side code
let API = {};

// the events object
const EVENT = {};

EVENT.windowCreate = function(callback){
    ipcRenderer.on('windowCreate', function(evnt, newWindow, thisWindow, windows) {
        callback(evnt, newWindow, thisWindow, windows);
    });
};

EVENT.windowClose = function(callback){
    ipcRenderer.on('windowClose', function(evnt, closedWindow, thisWindow, windows) {
        callback(evnt, closedWindow, thisWindow, windows);
    });
};

// The main on method to attach events
API.on = function(eventType, callback){
   EVENT[eventType](callback);
};

// create an API for window objects in web pages
contextBridge.exposeInMainWorld('API', API);
