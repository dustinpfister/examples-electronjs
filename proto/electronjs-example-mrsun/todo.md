# electionjs-example-mrsun

<!-- SAVE FOR FUTURE UPDATES -->

## (  ) - Move Sun Method?
* () have a gameMod.moveSun method that will be used in state objects such as 'world'
* () gameMod.moveSun will take an angle and distance from center

## (  ) - Always state objects, State object priority
* () have always state objects that will always fire each time regardless of what the current state object is
* () have a new system for the state keys where I can add a number after the key name to define what the priority should be
* () default priority for state objects can be 2, but can be set to 0 to get them to fire before always\_1

## (  ) - Water level, water block type
* () can set a water level such as 1 block so that any collum that is 0 rocks will have a water block

## (  ) - Slot Class, Disabled Slot feature 
* () a slot object will have a disbaled property which means that it can not be used at all

## (  ) - objpool.js, objpool.buttons.js
* () base object pool library
* () buttons lib that runs on top of base object pool lib. 

<!-- PROTOTYPE -->

## (  ) - r25 - Save and Load state
* () I will need a preload.js solution for saving and loading
* () just save and load a json file in the home folder

## (  ) - r24 - message system
* () Start a message system as a whole other file called mess.js
* () There needs to be a way to define what a condision is for a message

## (  ) - r23 - user events
* (done) I think I should use maybe EventDispatcher ( https://threejs.org/docs/index.html#api/en/core/EventDispatcher )
* () have a mana-total-zero event that will happen when mana and mana per tick are zero

## ( done 04/13/2023 ) - r22 - Switch to JSM
* (done) start switch to JSM over old script tags starting with decimal.mjs
* (done) have a utils.mjs
* (done) have a game.mjs
* (done) have a sm.mjs

## ( done 04/12/2023 ) - r21 - fix zero mana problem
* (done) have a start mana const
* (done) a new game will start with start mana const of course
* (done) If a player unlocks two slots, without creating one rock, there will be no way to make mana
* (done) test for this kind of condition where mana and mana\_per\_tick both equal 0
* (done) in the event of this kind of condition set mana to start mana const

## ( done 04/12/2023 ) - r20 - unlock button
* (done) add a gameMod.unlockSlot method in game.js
* (done) add an unlock button as part of the UI in world state
* (done) the function of unlocking the next slot up in a col should be apart from the creation of a new block

## ( done 04/11/2023 ) - r19 - new mana value
* (done) new mana value based on upgrade cost of a block
* (done) total mana value should be the cost of the current level + all lower levels
* (done) for now you just get back all the mana that was spent

## ( done 04/10/2023 ) - r18 - Better display of land objects in world state
* (done) have a utils.drawLandSection method that does what I am doing in the lands state
* (done) I would like to see a small grid for each land object in world state

## ( done 04/10/2023 ) - r17 - slots unlock bug
* (done) make lands slot unlock cost a decimal and format the output in lands state 
* (done) I might need to do alway with the limit on rock types per section

## ( done 04/10/2023 ) - r16 - Slot Class, Locked slot feature
* (done) block type total counts in lands object by adding up section counts
* (done) display totals in world state in sm.js
* (done) a slot object should have a locked boolean
* (done) make the fill style of a locked slot be cyan for now
* (done) check for locked status when creating, absorbing, and upgrading
* (done) The cost of the first slot should be free
* (done) check for locked status when updating, a locked slot should not have any effect to beging with
* (done) I will want a lands total for over all slots
* (done) I will want a lands object total for total unlocked slots
* (done) display unlocked/total slots in world state
* (done) have the cost for each slot unlock go up each time one is unlocked going by lands totals
* (done) display current slot unlock cost in landsstate

## ( done 04/09/2023 ) - r15 - Block Type Counts
* (done) make it so that when buying blocks they will start from the ground up
* (done) rename consts like BLOCK GRID WIDTH to SLOT GIRD WIDTH
* (done) block type counts for each section object by just adding up Slots
* (done) update counts each time a block is created or absorbed
* (done) use new bt\_count object in place of old LandSeciton.rock\_count
* (done) remove old LandSection.rock\_count

## ( done 04/08/2023 ) - r14 -  More Work with new Classes
* (done) get rock count to work again
* (done) have a Block.setLevel method
* (done) get upgrades working again with new classes
* (done) get block drop down fetaure working again with new LandSections class

## ( done 04/08/2023 ) - r13 - new class started
* (done) start the Slot Class
* (done) have a LandSection class that is used for all data that has to do with a single one of the land areas
* (done) have a Lands class that is a collection of LandSection objects
* (done) I will want a Lands.forEachSection method
* (done) I will want a LandSections.createSlotGrid method
* (done) the slot class should have a block property that by default has a blank type block
* (done) values like i, x, and y should be slot class values, not block class values
* (done) drawing slots in land state in sm.js
* (done) get pointer events to work again, but with new slot system in sm.js
* (done) get mana and temp update working again
* (done) Block Cost should just go by level

## ( done 04/08/2023 ) - r12 - Block class
* (done) using utils.formatDecimal for display of mana delta value
* (done) fix decimal points bug in utils.formatDecimal
* (done) have a Block class that will be a single block object such as a 'rock'
* (done) have a setManaValue method
* (done) use setManaValue in place of createManaValue helper
* (done) remove createManaValue helper

## ( done 04/07/2023 ) - r11 - max block count bug fix
* (done) see about fixing the max block count bug where I can go over 40 blocks if I click fast enough

## ( done 04/07/2023 ) - r10 - dropDownBlock helper - Block Gravity
* (done) I will need a dropDownBlocks helper that will drop down blocks
* (done) this method will need to be called when a block is absorbed

## ( done 04/07/2023 ) - r9 - getNextBlankBlock helper - Block Gravity
* (done) I should have a getBlockXY helper that will get an x,y pos from an index
* (done) I will need a getNextBlankBlock helper funciton in gameMod
* (done) this getNextBlankBlock will start from the bottom of a col and loop up until it finds a blank block
* (done) getNextBlankBlock will return false if no blank block is found, else it will return a ref to the block

## ( done 04/07/2023 ) - r8 - Display block info
* (done) have an actual display that shows up when a block is clicked rather than just logging to the console
* (done) click anywhere to make the display go away
* (done) display type
* (done) display mana value
* (done) display mana base and temp

## ( done 04/07/2023 ) - r7 - Button Style
* (done) all buttons should have lables
* (done) toggle buttons should have clear on and off style
* (done) button check helper
* (done) use button check helper for all buttons in land state

## ( done 04/06/2023 ) - r6 - Block Rock Type Upgrades
* (done) So then each block should be given a level prop when created for the first time
* (done) display level number for each block in land state
* (done) Start an 'upgrade' mode that will upgrade a block when clicked if it is a rock type
* (done) I will want an upgradeBlock game mod method
* (done) base and temp mana should go up with each level
* (done) the cost for an upgrade should go up each time just as with blocks

## ( done 04/06/2023 ) - r5 - Block value
* (done) started an 'info' block mode, just logging to the console for now with that
* (done) I think I should have a helper that creates a block value object
* (done) this block value object is created for the first time in the createBlockGrid helper
* (done) update the value object each time is block is bought or absorbed
* (done) use the block value object to find the amount of mana to give when a block is absorbed

## ( done 04/06/2023 ) - r4 - Blocks Modes, create and absorb
* (done) have a state.data.block\_mode property with a default setting of 'create' for the land state
* (done) the action that I all ready have when clicking a grid area can be this create mode
* (done) start an 'absorb' mode that will remove a block when clicked
* (done) display what the current block mode is
* (done) have create and absorb buttons to the left side
* (done) move the next and last buttons down
* (done) I will then want to start a gameMod.absorbBlock method
* (done) a mana value of the block will be added to game.mana when the block is absorbed

## ( done 04/06/2023 ) - r3 - Mana Level, Mana cap
* (done) have a game.mana\_level that will be used to define the current mana cap value
* (done) have a game.mana\_cap that will automacity bump forward up to the true max each time it is reached \( Like in Gemcraft \)
* (done) in gameMod.updateByTickDelta each time game.mana > game.mana\_cap bump up mana level and update cap
* (done) use mana\_cap over MANA MAX in utils.drawCommonDisp
* (done) display current cap in mana bar
* (done) update utils.formatDecimal method to allow for setting max decimal places

## ( done 04/05/2023 ) - r2 - Big Numbers and Mana
* (done) start using decimal.js for big numbers
* (done) use Decimal for game.mana value
* (done) use Decimal for game.mana\_per\_tick
* (done) see about having a nice format option for these decimal objects in utils.drawCommonDisp
* (done) still have a true max mana, but have it be a very large value based on what a very large limit should be for the game

## ( done 04/05/2023 ) - r1 - Land state switch buttons, improved display of status
* (done) utils.drawButton method
* (done) use utils.drawButton method for back button in land state
* (done) have switch state object + and - buttons in land state
* (done) have the canvas take up 100 percent of browser window
* (done) display mana per tick
* (done) constant object in game.js
* (done) display a mana bar

## ( done 04/05/2023 ) - r0 - Basic idea working
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
