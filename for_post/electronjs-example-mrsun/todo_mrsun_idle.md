# electionjs-example-mrsun todo list for 'mrsun-idle' stand alone project

<!-- Plans for 'MrSun idle' -->

<!-------- ----------
 SUNSPOTS
---------- ---------->

## () - rx - super nova state
* () start a whole new state for super nova
* () display the current sunspot multi, and what it will be after super nova event

## () - rx - sunspot upgrades
* () start a sunspot upgrades menu
* () the first upgrade can be something that lowers the base use to figure sunspots delta world value

## () - rx - sunspot delta min amount for super nova
* () have a min amount of sunspot coin delta that is needed to preform a super nova event

<!-------- ----------
 UI
---------- ---------->

## () - rx - Max Create button
* () have an option to do a max create when cretaing blocks

## () - half max button option
* () have a half max upgrade button option

<!-------- ----------
 RENDERING / GRAPHICS
---------- ---------->

## () - rx - Slot by slot real time rendering in world state
* () I would like to see about slot by slot, or maybe a few slots at a time, rendering in world state
* () I could have a whole other canvas element for rendering the slots
* () I coult have another canvas element that I use to render outlines for the current slots that are being rendered

## () - rx - Style change of blocks based on temp
* () the img objects used to render slots should change based on temp of the section

## () - rx - animated slots
* () I would like to have animated slots

<!-------- ----------
 STATE MACHINE
---------- ---------->

## () - rx - Always state objects, State object priority
* () have always state objects that will always fire each time regardless of what the current state object is
* () have a new system for the state keys where I can add a number after the key name to define what the priority should be
* () default priority for state objects can be 2, but can be set to 0 to get them to fire before always\_1

## () - rx - transition hooks
* () start transition events that will fire each time the setState method is called
* () have a onTransitionStart hook
* () have a onTransitionIn type hook
* () have a onTransitionOut type hook
* () have a renderTransition method that will be used in place for render when transitions are active

<!-------- ----------
 GAME MODULE
---------- ---------->

## () - rx - game ticks, and game.start_date as part of game save
* () store game.tick as part of the save state
* () be sure to set both game.tick and game.tick\_frac to opt.tick in gameMod.create
* () have a game.start\_date prop and make that part of the game save as well
* () log start date in away production message
* () log total tick count in away production message

## () - rx - Water level, water block type
* () can set a water level such as 1 block so that any column that is 0 rocks will have a water block

## () - rx - Slot Class, Disabled Slot feature 
* () a slot object will have a disabled property which means that it can not be used at all

<!-------- ----------
 NEW MODULES
---------- ---------->

## () - rx - object2d-dialog - start a message system
* () start a message system as a whole other file called mess.js
* () use the standard objects in objpool for message dialogs
* () not enough mana to create block message
* () not enough mana to upgrade block message
* () no blank blocks to create message

## () - rx - object2d-buttons.js
* () that a buttons lib that extends Object2D

<!-------- ----------
 BROWSER BUILD
---------- ---------->

## () rx - PLATFORM-BROWSER
* () start a BROWSER form of the API that I have in preload.js
* () just use local storage for this and move on

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