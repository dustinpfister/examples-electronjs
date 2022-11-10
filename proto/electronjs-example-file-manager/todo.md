# electionjs-file-manager

## () - css media queries
* () media queries for grid

## () - file types, and open with
* open with options

## () - copyN, diolog
* () have it so I can make more than one copy of an item in the same folder as the item
* () This might just only need to happen WHEN IT IS THE SAME FILE, otherwise I might want to overwrite
* () It would be best to have a prompt for this and other simular conditions

## () - Rename files
* () can rename a file by clicking it and then clicking it again after say 200ms of whatever I set for double click speed
* () can also rename from item menu

## () - Item Menu, double click
* () - Clicking a single selected item will brink up an item menu
* () - For folders there is an open option
* () - work out double clicking
* () - Can double click a folder to open fast
* () - can click any area in main pwd div that is not an item to unselected all

## () exec file style for exec files only
* () have a lime green style for files only if it is a chmod 777 deal
* () have a base style for .js and .sh
* () remove old css classes that are not used to set background color

## () - select more than one file
* () can select more than one file or folder by holding down CTRL

## () - create new 
* () create new file
* () create new folder

## () Delete Selected
* () delete a single selected file

## ( done 11/09/2022 ) - new item loop method
* (done) new item loop method that does not uset set time out
* (done) so far this seems to have fixed a bug with the progress bar that was the result of a race condition

## ( done 11/08/2022 ) - EDIT MENU, cut, paste single file
* (done) start an edit menu
* (done) copy one file at a time
* (done) paste one file at a time

## ( done 11/08/2022 ) - up one button
* (done) add an up one button button to the tool bar
* (done) I am going to need a new fm method for this I think

## ( done 11/08/2022 ) - select none
* (done) can click on any area that is not an item to select none

## ( done 11/08/2022 ) - run alt button
* (done) have a Alt FM button that will start another File manager app at the current location

## ( done 11/08/2022 ) - get fm.runFile to work with start.sh files
* (done) I can not get my start.sh files to work see about fixing this
* (done) it was becuase of the cwd option!

## ( done 11/08/2022 ) - mime type style
* (done) I will want to set style by mime type
* (done) if a file is executable display it with a differing style from other files
* (done) fixed a bug where the item loop was continuing after a set pwd call

## ( done 11/08/2022 ) itemData mime type element, run exec files
* (done) update createItemClickHandler to use itemData\[4\].mime
* (done) use ( $ find ./index.js -maxdepth 1 -type f -executable ) to find out if a file is executable
* (done) can click twice to run the file

## ( done 11/08/2022 ) itemLoop
* (done) have an if for 'text/x-shellscript' mime
* (done) pull all javascript code into a js file called window_main.js for now
* (done) see about getting CSP working with this
* (done) stat object as itemData\[4\]
* (done) ext prop part of fileInfo object
* (done) see about making the creation of list contents an item by item basis in setPWD
* (done) looks like I will need something like an app loop, but for updating mime type
* (done) have a progress bar for mime type update
* (done) mime type should be an element of the itemData array

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
