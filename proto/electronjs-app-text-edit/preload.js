// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

const textAPI = {
    // CLIENT EVENT for open file option in menu
    onMenuOpenFile: function(callback){
        // should get a result object from main.js
        ipcRenderer.on('menu-open-file', function(evnt, result) {
            const filePath = result.filePaths[0];
            textAPI.getText(filePath, (text)=>{
                callback(evnt, text, result)
            });
        });
    },
    // CLIENT EVENT for save file option in menu
    onMenuSaveFile: function(callback){
        ipcRenderer.on('menu-save-file', callback);
    },
    getText: function(filePath, callback){
        fs.readFile(filePath, 'utf8', (err, text) => {
            if(err){
                // error reading file
                console.log(e.message);
            }else{
                callback(text);
            }
        });
    },
    // save the given text to the given file path
    saveText: function(text, filePath){
        fs.writeFile(filePath, text, 'utf8', (e) => {
            if(e){
                // if error writing file
                console.log(e.message);
            }
        });
    }
};


// create an api for window objects in web pages
contextBridge.exposeInMainWorld('textAPI', textAPI);


console.log('preload');
