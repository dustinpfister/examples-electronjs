# electionjs-example-mrsun todo list for 'mrsun-idle' stand alone project

<!-- Plans for 'MrSun idle' -->

## () - rx - Always state objects, State object priority
* () have always state objects that will always fire each time regardless of what the current state object is
* () have a new system for the state keys where I can add a number after the key name to define what the priority should be
* () default priority for state objects can be 2, but can be set to 0 to get them to fire before always\_1

## () - rx - Water level, water block type
* () can set a water level such as 1 block so that any column that is 0 rocks will have a water block

## () - rx - Slot Class, Disabled Slot feature 
* () a slot object will have a disabled property which means that it can not be used at all

## () - rx - object2d-dialog - start a message system
* () start a message system as a whole other file called mess.js
* () use the standard objects in objpool for message dialogs
* () not enough mana to create block message
* () not enough mana to upgrade block message
* () no blank blocks to create message

## () - rx - object2d-buttons.js
* () that a buttons lib that extends Object2D

## () rx - PLATFORM-BROWSER
* () start a BROWSER form of the API that I have in preload.js
* () just use local storage for this and move on

## () rx - server script
* () I would like to have a script that will run a simple static server
* () have it so that I can call npm run server to start the server
* () with the server script I am hosting the game over the network on a given port

## () - rx - See about fixing init state stuck bug
    With electionjs there seems to be a bug where I can end up getting stuck in init state. In windows I can trigger this by reloading a whole bunch of times real fast.

## () - rx - save as and open options
* () save as option for the current autosave
* () open menu option to load a save, and thus replace the autosave

## () - rx - sunspot upgrades
* () start a sunspot upgrades menu
* () the first upgrade can be something that lowers the base use to figure sunspots delta world value

