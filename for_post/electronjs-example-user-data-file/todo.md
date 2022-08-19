# electionjs-user-data-file todo list

## () - menu items

## () - text area for content, updaing use data on file save
* () have another textarea in which to place text content that will be opened or saved
* () make it clear as to what text area is for what
* () update dir\_open\_start on save events also

## ( done 08/19/2022 ) - user-data.js, updaing use data on file open
* (done) have a UserDataApp.setUserData method in preload.js
* (done) have a user-data.js file for common methods to use between main.js and preload.js
* (done) have a UserData.create method and use that in place of what is in main.js
* (done) remove old main.js code
* (done) I will want to use new user-data.js module in preload as well
* (done) use dialog to open a file, and when doing so use UserDataApp.setUserData to set a new state for dir\_open\_start

## ( done 08/18/2022 ) - basic idea working
* (done) start with the menu example
* (done) on start create a folder in the current user folder called '.userDataApp'
* (done) create a file called data.json in the '.userDataApp' folder if it is not there to begin with
* (done) the data file will store the location of a start dir to look for files
* (done) have a UserDataApp.getUserData method in preload.js
* (done) use UserDataApp.getUserData to get the current state of user data from the client system
* (done) display the current state of all of this in the browser window