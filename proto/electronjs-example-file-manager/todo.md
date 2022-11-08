# electionjs-file-manager

## () - Improved CSS
* () media queries for grid

## () - Create file, delete file

## () - Create folder, Delete folder

## () - file types, and open with

## () - cut, copy, paste
* () can select more than one file or folder by holding down CTRL

## () - Rename files
* () can rename a file by clicking it and then clicking it again after say 200ms of whatever I set for double click speed
* () can also rename from item menu


## () - Executable Files
* () see about having custom style for executable files such as my sh files
* () double clicking a executable file will run that file

## () - Item Menu, double click
* () - Clicking a single selected item will brink up an item menu
* () - For folders there is an open option
* () - work out double clicking
* () - Can double click a folder to open fast
* () - can click any area in main pwd div that is not an item to unselected all

## () itemData mime type element, run exec files
* () mime type should be an element of the itemData array
* () update createItemClickHandler to use itemData\[4\].mime
* () if a file is executable display it with a differing style from other files
* () use ( $ find ./index.js -maxdepth 1 -type f -executable ) to find out if a file is executable
* () can click twice to run the file

## ( done 11/08/2022 ) itemLoop
* (done) have an if for 'text/x-shellscript' mime
* (done) pull all javascript code into a js file called window_main.js for now
* (done) see about getting CSP working with this
* (done) stat object as itemData\[4\]
* (done) ext prop part of fileInfo object
* (done) see about making the creation of list contents an item by item basis in setPWD
* (done) looks like I will need something like an app loop, but for updating mime type
* () have a progress bar for mime type update

## ( done 11/03/2022 ) - default applactions/actions based on mime type
* (done) work out some code that uses the file command with the cut command to get a mime tyoe for a file
* (done) if there is a default command for the mime type langue that command for the file

## ( done 11/03/2022 ) - Sort items, css, select items
* (done) sort the list of files so that folders come up on top
* (done) not selecting text of items
* (done) using grid for css
* (done) using realpath to convert ~ to /homr/currentuser
* (done) fixed position for new toolbar div
* (done) a current collection of files array should be part of the state object as state.files
* (done) have index values for each item in state.files
* (done) index values will need to be updated when sorting state.files
* (done) A single click of a folder will select that folder by adding the state.files index to a state.selected array
* (done) if just one item is selected, and it is a folder, a second click of it will cuase a setPWD
* (done) can select files and folders
* (done) item click handler called for all items
* (done) css for selcted files

## ( done 11/02/2022 ) - New window, nav folders, open terminal
* (done) The file menu should just have a new window, and close option for now
* (done) I can just use plain old html and css for creating lists of files and folders
* (done) clicking a folder link will change the current working dir to that folder
* (done) have a text input element that will be the current absolute path
* (done) text input path can also be used to set current working path
* (done) I will want a way to run a command at the current folder
