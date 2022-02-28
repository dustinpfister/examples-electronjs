# electionjs-app-text-edit todo list

## () - rx - right click menu

## () - rx - document modes 

## () - rx - blank operations

## () - r2 - tabs
* can have more than one file open and switch between them
* open more than one file at once

## () - r1 - Syntax highlighting, line numbers, and view menu started
* see about reproducing this.
https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/
* So I will want to use prism.js on top of electron.js
https://github.com/PrismJS/prism
https://prismjs.com/
* add line numbers
* start a view menu
* turn status bar on and off by way of view menu
* turn line numbers on and off by way of vew menu
* turn syntax highlighting on and off by way of view menu

## () - r0 - first release
* (done) start with the source code from the context bridge example that is all ready a basic text editor
* (done) see about using a menu.js file in root to pull that code out of main and into its own file
* (done) I am going to want to have a status bar div
* (done) change the html and css so that the text area takes up all of the window aside from a little area for the status bar div
* (done) status text style
* (done) see about having file name as title text
* (done) show byte count in status bar
* (done) menu-error event
* (done) menu-cancel event

* have copy, cut, and paste
* select all
* save option in file menu 
