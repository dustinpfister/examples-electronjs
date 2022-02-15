# electionjs-browser-window todo list

## () - r2 - IPC Hello world
* use ipcMain in main.js to create set color event
```
// soemthing like this
let current_color = 'black';
ipcMain.handle('my-app-set-color', async (event, color) => {
  current_color = color;
})
```
* in preload try seomthing like this as part of the api
```
ipcRenderer.invoke('my-app-set-color', 'red')
```
* the goal with this is to set a variable value in main.js from the main window that will be used to set a current color
* in a child window I will then want to draw to a canvas element, and when doing so the current color value is what should be used

## ( done 02/15/2022 ) - r1 - front end javaScript, preload, contextIsolation
* (done) use the parent prop for child windows and the BrowserWindow.fromId method
* (done) have some front end javaScript running
* (done) have a preload.js file
* (done) have a client.js file in the html folder that will be used by the html files

## ( done 02/14/2022 ) - r0 - background, child windows, More than one Menu
* (done) start with the background property
* (done) I will want a createWindow helper function
* (done) have two menus, one for the main window, and another for a child window
* (done) See about creating a child window from a menu option
* (done) start an html folder
* (done) have a separate html file for a child window