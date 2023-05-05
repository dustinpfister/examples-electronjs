# electionjs-example-mrsun todo list for 'mrsun-idle' stand alone project

<!-- Plans for 'MrSun idle' -->

<!-------- ----------
 MRSUN-GAME
---------- ---------->

## () - rx - sunspot upgrades state object
* () start a sunspot upgrades menu
* () the first upgrade can be something that lowers the base use to figure sunspots delta world value

## () - rx - total game ticks
* () have a grand total game ticks count that will not reset with a super nova event
* () this will have to be part of the save
* () display this total in supernova state
* () display game start time in supernova state

## () - rx - level up game event
* () have an event that will fire each time a level up happens
* () in the event that the player jumps up a whole bunch of levels at once the event should fire for each level

## () - rx - Water level, water block type
* () can set a water level such as 1 block so that any column that is 0 rocks will have a water block

## () - rx - Slot Class, Disabled Slot feature 
* () a slot object will have a disabled property which means that it can not be used at all

<!-------- ----------
 MRSUN-UTILS/utils.js
---------- ---------->

## () - rx - utils format decimal, percision
* () it looks like there are still some problems with this method that require further testing
* () I think that I should have percision and dp arguments for this funciton
* () the percision value should be used

<!-------- ----------
 MRSUN-STATEMACHINE
---------- ---------->

## () - rx - State switcher UI
* () I would like to have a state switcher UI
* () I could have a main button that will show or hide the state switcher UI
* () The state switcher UI will have a button for world and land state.

## () - rx - Max Create button
* () have an option to do a max create when cretaing blocks

## () - rx - Half max button option
* () have a half max upgrade button option

<!-------- ----------
 RENDERING / GRAPHICS
---------- ---------->

## () - rx - Slot by slot real time rendering in world state
* () I would like to see about slot by slot, or maybe a few slots at a time, rendering in world state
* () Have a whole other canvas element for rendering the slots
* () Have another canvas element that I use to render outlines for the current slots that are being rendered

## () - rx - Style change of blocks based on temp
* () the img objects used to render slots should change based on temp of the section

## () - rx - Animated slots
* () I would like to have animated slots

<!-------- ----------
 STATE MACHINE
---------- ---------->

## () - rx - Always state objects, State object priority
* () have always state objects that will always fire each time regardless of what the current state object is
* () have a new system for the state keys where I can add a number after the key name to define what the priority should be
* () default priority for state objects can be 2, but can be set to 0 to get them to fire before always\_1

## () - rx - Transition hooks
* () start transition events that will fire each time the setState method is called
* () have a onTransitionStart hook
* () have a onTransitionIn type hook
* () have a onTransitionOut type hook
* () have a renderTransition method that will be used in place for render when transitions are active



<!-------- ----------
 OBJECT2D class
---------- ---------->

## () - rx get children feature of Base Object2d class working
* () I would like to get the add feature of the object2d class working

## () - rx - object2d-dialog - start a message system
* () start a dialog system as a whole other file called dialog.js
* () pop up dialog window types with okay, cancel, ect.
* () message window type objects that are used to display status messages

## () - rx - object2d-buttons.js
* () have a buttons lib that extends the Object2D class

<!-------- ----------
 BROWSER BUILD
---------- ---------->

## () rx - browser platform file
* () Start a BROWSER form of the API that I have in preload.js
* () See if using local storage for this will work fine

## () rx - server script
* () I would like to have a script that will run a simple static server
* () have it so that I can call npm run server to start the server
* () with the server script I am hosting the game over the network on a given port
* () this should just host the browser build version of the game over the network

<!-------- ----------
 ELECTIONJS BUILD FEATURES
---------- ---------->

## () - rx - save as and open options
* () save as option for the current autosave
* () open menu option to load a save, and thus replace the autosave

<!-------- ----------
 BUGS
---------- ---------->

## () - rx - See about fixing init state stuck bug
    With electionjs there seems to be a bug where I can end up getting stuck in init state. In windows I can trigger this by reloading a whole bunch of times real fast.

