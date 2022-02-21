// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('myAPI', {
    func: function(){
        return 'hello world';
    },
    // CLIENT EVENT for open file option in menu
    onMenuOpenFile: function(callback){
        ipcRenderer.on('menu-open-file', callback)
    },
    // CLIENT EVENT for save file option in menu
    onMenuSaveFile: function(callback){
        ipcRenderer.on('menu-save-file', callback)
    },
    // save the given text to the given file path
    saveText: function(text, filePath){
        fs.writeFile(filePath, text, 'utf8', (e) => {
            if(e){
                // if error writing file
                console.log(e.message)
            }
        })
    }
});


console.log('preload');
