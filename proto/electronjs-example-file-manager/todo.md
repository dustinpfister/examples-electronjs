# electionjs-file-manager

## () - rx - Create file, delete file

## () - rx - Create folder, Delete folder

## () - rx - file types, and open with

## () - rx - cut, copy, paste

## () - rx - rename

## () - r1 - sort items, css, select items
* (done) sort the list of files so that folders come up on top
* (done) not selecting text of items
* (done) using grid for css
* (done) using realpath to convert ~ to /homr/currentuser
* (done) fixed position for new toolbar div

* () a current collection of files array should be part of the state object
* () A single click of a folder will select that folder by adding the state.files index to a state.selected array
* () if just one item is selected, and it is a folder, a second click of it will cuase a setPWD
* () can select more than one file or folder

* () media queries for grid

## ( done 11/02/2022 ) - r0 - New window, nav folders, open terminal
* (done) The file menu should just have a new window, and close option for now
* (done) I can just use plain old html and css for creating lists of files and folders
* (done) clicking a folder link will change the current working dir to that folder
* (done) have a text input element that will be the current absolute path
* (done) text input path can also be used to set current working path
* (done) I will want a way to run a command at the current folder
