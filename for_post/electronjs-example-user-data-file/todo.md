# electionjs-user-data-file todo list

## () - menu items

## () - UserDataApp.setUserData, file open
* () have a UserDataApp.setUserData method in preload.js
* () have another textarea in which to place text content that will be opened
* () use dialog to open a file, and when doing so use UserDataApp.setUserData to set a new state for dir_open_start

## ( done 08/18/2022 ) - basic idea working
* (done) start with the menu example
* (done) on start create a folder in the current user folder called '.userDataApp'
* (done) create a file called data.json in the '.userDataApp' folder if it is not there to begin with
* (done) the data file will store the location of a start dir to look for files
* (done) have a UserDataApp.getUserData method in preload.js
* (done) use UserDataApp.getUserData to get the current state of user data from the client system
* (done) display the current state of all of this in the browser window