# electionjs-context-bridge todo list

## (  ) - r1 - myAPI.onMenuError
* (done) Looks like I will not be using ipcMain in main.js for this one.
* I will also want a myAPI.onMenuError
* emmit myAPI.onMenuError for errors that might happen when opening a file
* emmit myAPI.onMenuError for erros that might happen when saving a file

## ( done 02/21/2022 ) - r0 - Context bridge, hello world
* (done) start with the source code from the browser window example
* (done) I am going to just want a single winodw for this project
* (done) remove unused code from html folder
* (done) update html title tags and style
* (done) start an open option in the file menu
* (done) I am going to need to use the dialog class in main and or preload
* (done) using the send method of windowContents in main.js to send text loaded with an open option in the Menu in Main.js
* (done) start a save As option in the file menu
* (done) I am going to need a onMenuSaveFile method in myAPI in preload
* (done) see about prefroming the open file, filesystem module call in preload.js rather than main.js
