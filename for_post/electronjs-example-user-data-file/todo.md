# electionjs-user-data-file todo list

## () - menu items

## () - UserDataApp.setUserData, file open
* (done) have a UserDataApp.setUserData method in preload.js
* (done) have a user-data.js file for common methods to use between main.js and preload.js

* () have a UserData.createUserDataFile and use that in place of what is in main.js
* () remove old main.js code

* () have another textarea in which to place text content that will be opened
* () use dialog to open a file, and when doing so use UserDataApp.setUserData to set a new state for dir\_open\_start

## ( done 08/18/2022 ) - basic idea working
* (done) start with the menu example
* (done) on start create a folder in the current user folder called '.userDataApp'
* (done) create a file called data.json in the '.userDataApp' folder if it is not there to begin with
* (done) the data file will store the location of a start dir to look for files
* (done) have a UserDataApp.getUserData method in preload.js
* (done) use UserDataApp.getUserData to get the current state of user data from the client system
* (done) display the current state of all of this in the browser window