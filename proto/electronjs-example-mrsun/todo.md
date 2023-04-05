# electionjs-example-mrsun

## (  ) - Move Sun Method?
* () have a gameMod.moveSun method that will be used in state objects such as 'world'
* () gameMod.moveSun will take an angle and distance from center

## (  ) - Always state objects, State object priority
* () have always state objects that will always fire each time regardless of what the current state object is
* () have a new system for the state keys where I can add a number after the key name to define what the priority should be
* () default priority for state objects can be 2, but can be set to 0 to get them to fire before always\_1

## () Save and Load state
* () I will need a preload.js solution for saving and loading
* () just save and load a json file in the home folder

## (  ) - Better display of land objects in world state
* () I would like to see a small grid for each land object in world state
* () toggle dev tools menu option

## () - Water level, water block type
* () can set a water level such as 1 block so that any collum that is 0 rocks will have a water block

## (  ) - Block Type Counts
* () block type counts for each block type
* () counts for each type in each land object
* () global total counts in game object
* () use global rock count over that of land for setting next block price 

## (  ) - Block Rock Type Upgrades
* () 

## (  ) - Block Gravity
* () a block placed in the grid will drop down to the floor

## (  ) - Big Numbers and Mana
* (done) start using decimal.js for big numbers
* (done) use Decimal for game.mana value
* (done) use Decimal for game.mana\_per\_tick

* () see about having a nice format option for these decimal objects in utils.drawCommonDisp

* () still have a true max mana, but have it be a very large value based on whatever the limits are for what is being used
* () have a game max mana that will automacity bump forward to the true max each time it is reached \( Like in Gemcraft \)

* () use Decimal for next block cost

## ( done 04/05/2023 ) - Land state switch buttons, improved display of status
* (done) utils.drawButton method
* (done) use utils.drawButton method for back button in land state
* (done) have switch state object + and - buttons in land state
* (done) have the canvas take up 100 percent of browser window
* (done) display mana per tick
* (done) constant object in game.js
* (done) display a mana bar

## ( done 04/05/2023 ) - Basic idea working
* (done) use a canvas element for the whole game
* (done) start a game.js file that will be used to create, and update a game state object
* (done) have a state machine in a sm.js file
* (done) have an init state object
* (done) a game state object will store the sun position
* (done) have a 'world' state in which I have the sun and land section
* (done) use pointer events and define what these do on a state by state basis
* (done) I will want a utils.js javascript file to place distance method, anything else that comes up
* (done) have a max distance const in game.js
* (done) a game state object will contain the number of land objects
* (done) have a gameMod.getLandByPos method that will return a land object at a given pos if it is there else false
* (done) have a 'land' state in which I can view a single land section in detail
* (done) have a back button that will return the user to 'world' state
* (done) have a game.mana value at a given start value of say 1
* (done) display current mana in world and land states
* (done) each land object can contain zero of more blocks up to a max number of blocks per land section
* (done) I am thinking 10 by 8 so that means up to 80 blocks per land object, or slots for blocks at least
* (done) add bounding box to utils
* (done) can click on the grid and get a block index in land state
* (done) 'blank', and 'rock' block types
* (done) first block costs 1 mana
* (done) have a game.tick, and game.tick\_last
* (done) have a game.updateByTickDelta method
* (done) I will need a helper that will update a main game.mana\_per\_tick value based on the state of the blocks
* (done) update main mana by mana per tick value
* (done) have a base amount of 1 mana per block that is not blank
* (done) once there is a block in a land section that is not blank it will start to generate mana over time
* (done) replace getManaPerTick helper with new forEachLandBlock helper function
* (done) use new forEachLandBlock helper in updateByTickDelta to update mana.
* (done) have a land.temp value that is effected by land.sun\_d
* (done) display land.temp for each land object in world state
* (done) have a temp bonus of up to 4 more mana per block based on land object distance to sun'
* (done) display land.temp value for the current land object in land state
* (done) have a MANA\_MAX const
* (done) have a gameMod.buyBlock public method
* (done) have a database of rock types in game.js and NOT in sm.js
* (done) the cost of the mana blocks goes up with each block
* (done) rename MAX\_SUN\_DIST to SUNAREA\_RADIUS
