// preload with contextIsolation enabled
const { contextBridge } = require('electron');
const path = require('path');

// create an api for window objects in web pages
contextBridge.exposeInMainWorld('api', {
  videoFilePath: path.join(__dirname, 'html/js/video-start.js'), 
  func: function(){
      return 'hello world';
  }
});


console.log('preload');