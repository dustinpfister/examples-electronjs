# electionjs-example-mrsun

<!-- SAVE FOR FUTURE UPDATES -->

## () - rx - Move Sun Method?
* () have a gameMod.moveSun method that will be used in state objects such as 'world'
* () gameMod.moveSun will take an angle and distance from center

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

## () - rx - Sprites for Land State Land Sections
* () have a new sprite object like what I am using in the world state only for the land state
* () I will need a LandSection.sprite\_land property
* () if the new solution for land sprites is working remove code for the old solution I was using in utils

## () - rx - Sprite sheets for Land Section Sprites
    If I work out a solution that works good for detail textures of slots I will now want to see about creating sprite sheets. In other words if thinks look good I now need to think in terms of making things run smotther by not doing real timer rendering of graphics on each frame tick for each slot.
* () have more than one Sprite sheet for each land section where a set of three will be for each slot/block type

## () rx - local storage autosave
* () I will need a local storage autosave feature

## () rx - server script
* () I would like to have a script that will run a simple static server
* () have it so that I can call npm run server to start the server
* () with the server script I am hosting the game over the network on a given port

## () rx - file save
* () I should be able to do a crtl+s to save at any time

## () - rx - use img data objects to render land state blocks
* () see about using the IMG Objects in the process of drawing land state blocks also

## () - rx - See about fixing init state stuck bug
    With electionjs there seems to be a bug where I can end up getting stuck in init state. In windows I can trigger this by reloading a whole bunch of times real fast.

## () - rx - more than one autosave file?
* () I think I will need an autosave\_0.txt and a autosave\_1.txt
* () each auto save event will save to 0 or 1 but never both at the same time
* () always start by loading auto save 0, of that is not valid try 1

## () - rx - save as and open options
* () save as option for the current autosave
* () open menu option to load a save, and thus replace the autosave

## () - rx - sunspots value effected by unlock slot count?
* () sunspot delta value should be effected by total number of slots unlocked

## () - rx - sunspot upgrades
* () start a sunspot upgrades menu
* () the first upgrade can be something that lowers the base use to figure sunspots delta world value

<!-- PROTOTYPE -->

## () - rx - set mana stats Block class method
* () have a block.setManaStats method that will be used to set the various mana values
* () have a mana delta value for each block
* () display mana delta in block info

## () - rx - better world state rendering
* () I would like to work out a process for rendering the world state a few slots at a time
* () start by checking out a way to render 1 slot per frame tick.

## () - rx - mrsun-lands lib folder
* () pull all code that has to do with the Lands class into its own mjs file
* () update game.mjs to make use of new lands.mjs file
* () create and update readme files

## () - rx - min sunspot delta for supernove
* () have a min amount of sunspot coin delta that is needed to prefrom a super nova event

## ( done 04/28/2023 ) - r61 - rename MS api as Platform
* (done) have an sm.platform property that will store the value of MS
* (done) have the default value of platform be what I have in the utils MS check method
* (done) have a game.platform property and use that in place of MS in gameMod.saveGame
* (done) rename MS as PLATFORM in preload.js

## ( done 04/28/2023 ) - r60 - fix formating, start of a main.mjs file
* (done) see about fixing a formtaing problem with decimals
* (done) have an sm\_old.mjs file that will still be the old main start file for now
* (done) just append sm to window in sm\_old.mjs as a way to get my public sm object back
* (done) update sm.mjs to export a main object
* (done) start a have a main.mjs file that will use the new sm.mjs file
* (done) still use old sm for now

## ( done 04/28/2023 ) - r59 - mrsun-constants
* (done) the constant object in game.mjs should be in a seperate module folder
* (done) update game.mjs to use new constants module
* (done) update sm.mjs to use the new constants module
* (done) update utils.mjs to use the new constants module
* (done) remove code that appends constant values to game object, as it should no longer be needed at this point
* (done) constant.SAVE_STRING value for sm.mjs

## ( done 04/27/2023 ) - r58 - away production
* (done) have a game.last_update property that is set to a new date on each update
* (done) have a gameMod.awayCheck method that will be called once in the init state
* (done) have gameMod.awayCheck compute a tick delta based on the current time less the value stored
* (done) just credit mana for now

## ( done 04/27/2023 ) - r57 - Expression for setting sunspots delta world value
* (done) I want to have an expression that will adjust the base that is used to figure sunspots world delta
* (done) started a getSunspotWorldValueBase helper function for this in game.mjs
* (done) I will want a constant.SUNSPOTS-WORLDVALUE-BASE-MAX
* (done) I will want a constant.SUNSPOTS-WORLDVALUE-BASE-MIN
* (done) I will want a constant.SUNSPOTS-WORLDVALUE-MAXMANA that will be the point at which the min base is reached

## ( done 04/27/2023 ) - r56 - sunspot delta effected by world mana value
* (done) have a block.getUpgradeCost method
* (done) mana total value for section objects
* (done) mana total value for lands object
* (done) display mana totals for each section, and also the lands total in world state
* (done) use lands total mana value in expression for sunspot delta

## ( done 04/26/2023 ) - r55 - start supernova feature, and sunspots coin
* (done) I will need a game.sunspots value that will be a Decimal value like that of mana
* (done) game.sunspots will need to be part of a game save
* (done) display sunspots value
* (done) I need an expression that will evaluate to the number of sunspot coins that will be given if super nova is done
* (done) sunspot delta value should be effected by mana level
* (done) for now sunspot coins will effect base mana and temp mana of blocks
* (done) have a super nove button

## ( done 04/26/2023 ) - r54 - mrsun-statemachine, mrsun-utils, mrsun-game
* (done) pull sm.mjs into its own lib folder
* (done) update all file locations that are needed
* (done) pull utils into its own lib folder
* (done) rename mrsun-core to mrsun-game
* (done) create and update readme files

## ( done 04/25/2023 ) - r53 - autosave on close
* (done) now that it looks like I have a good solution for autosave I should do one on game close

## ( done 04/25/2023 ) - r52 - updated save features for preload.js
* (done) gameMod.saveGame method
* (done) try a visibilitychange event first in the client
* (done) try a save file script with a detached fork child process call in preload.js

## ( done 04/24/2023 ) - r51 - utils.MSCheck method
* (done) I want a utils.MSCheck method that will check for a global MS Api object
* (done) if the MS Object is there, then it will just return that
* (done) if the MS Object is not there it will return a default api to use
* (done) for now the default API can just be dummy methods (no save / advanced features)

## ( done 04/24/2023 ) - r50 - use Vector2 distance to over utils.distance in game.mjs
* (done) I will need to replace section.x, y with section.position.x, y
* (done) use vector2.dostnaceTo in gameMod.updateByTickDelta
* (done) use vector2.distanceTo in gameMod.setSunPos
* (done) use vector2.distanceTo in gameMod.getSectionByPos
* (done) remove utils.distance if it is no longer used

## ( done 04/24/2023) - 49 - use Vector2 distance over utils.distance in sm.js
* (done) vector2 objects for all buttons used in land state in sm.js
* (done) have getPointerPos method return a vector2 object
* (done) update button check helper to use vector2 distnaceTo in sm.js
* (done) update pointer down events to use vector2 objects and use distnaceTo method in pointerdown event for world state in sm.js
* (done) update utils draw button method

## ( done 04/23/2023 ) - r48 - width and height values for img data objects
* (done) I should have width and height values for these img objects
* (done) I will want to get an image object in the drawSectionSlot method
* (done) use the image data object to find the number of times I need to call drawSectionSlotTexel, and also pass proper args
* (done) see about using the width and height to adjust what the res will be when rendering

## ( done 04/23/2023 ) - r47 - image data objects for drawSectionSlotTexel
* (done) the image data objects used for the drawSectionSlotTexel method should be outside of the method
* (done) I should have an object that is a database of sorts for these
* (done) have a default one that will be used in the event that the one can not be found for the current slot
* (done) have an image objects for locked, blank, and rock

## ( done 04/23/2023 ) - r46 - texelY, and texelX for drawSectionSlotTexel helper
* (done) start out by getting the texelY value to adjust the radius range value as needed
* (done) crude image data for now
* (done) I will then want to have rad slot start and rad slot end vars in the drawSectionSlotTexel method
* (done) new expressions for rad start and rad end that take into account the texelX value

## (done 04/22/2023 ) - r45 - improved draw section arc method
   It might be possible to use the create pattern method still, but now I am thinking that it might be better to just work out an improved draw section arc method. That all ready does work well I just need to find a way to make the method a little more fine grain to draw a grid of sorts inside the slot with differing colors.
* (done) rename drawSectionArc to drawSectionSlot method
* (done) start a new drawSectionSlotTexel method that will be used to draw each texel in one of these slots

## (done 04/21/2023) - r44 - create pattern and rotation
    I still want to work out how to go about using the create pattern 2d context method to create fill style textures when drawing slots
    This will need to be done before I move on to anything more that has to do with graphics including more efficient rendering. it would look like this is might not work out so well, so I am thinking I might want to find another solution.
* (done) I will want to start out with some kind of texture where rotation matters, like a triangle.
* (done) one goal then would be to get the center of this triangle to be in the center of each slot

## ( done 04/21/2023 ) - r43 - texture for slots in world state
* (done) I will want another canvas for creation of textures that will be used for a fill style
* (done) use create pattern 2d context method to get fill styles for blocks
* (done) rename createRenderSheet helper to createSectionRenderSheet in game.mjs
* (done) I will need to see about setting the rotation of these new textures as needed by having a texture that will help me get an idea about this at least.

## ( done 04/20/2023 ) - r42 - fix block absorb bug
* (done) mana value of blocks is way to high.

## ( done 04/19/2023 ) - r41 - invert block display
* (done) invert the block display

## ( done 04/18/2023 ) - r40 - draw section arc helper
* (done) I want a draw section arc helper function
* (done) use this draw section arc helper when drawing the section canvas
* (done) have arguments for draw secton helper
* (done) see about using this to draw all slots of all sections

## ( done 04/18/2023 ) - r39 - Single Render Sheet
* (done) I am going to need a single final render sheet that will be what is used for the final draw with SpriteLandSectonWorld
* (done) The SpriteLandSectonWorld class will need to have the canvas updated over time, so this class will need an update method
* (done) have just a basic starting point for what I want with this
* (done) see about having a crude start at least for arcs

## ( done 04/17/2023 ) - r38 - start Sprites for World state Land Sections
* (done) adjusted sun size and sun radius
* (done) have a SpriteLandSectonWorld class that extends the Sprite class
* (done) I will need a LandSection.sprite\_world property that is an instance of SpriteLandSectonWorld
* (done) for SpriteLandSectonWorld class I think I will need a sheet for each landSection object

## ( done 04/17/2023 ) - r37 - Sun Animaiton Sheet
* (done) can1 layer: should be the base sun texture
* (done) update can1 layer over time by just stepping and wraping the cell index value
* (done) can1 layer: have these triangles rotate over the course of the cells
* (done) can1 layer: have a bunch of trangles drawn around the base circle
* (done) can2 layer: should be the face on top of the base, just have one expression at cell 0 \( for now \)

## ( done 04/17/2023 ) - r36 - Sun class
* (done) start a Sun class in game.mjs that extends the Sprite class
* (done) replace the current sun object with an instance of the Sun class
* (done) becuase Sun is an extension of Sprite see about using what I set up with the test sprite with game.sun
* (done) if all goes well remove the old test sprite as it is no longer needed at this point

## ( done 04/17/2023 ) - r36 - Layers for Sprite class
* (done) make it so that I can have an array of SpriteSheet objects rather than just one for a Sprite
* (done) if I have an array of sprite sheets I will also need an array of Cell index values
* (done) in the event that there is an array of sprite sheets the sheet of index 0 will be rendered first
* (done) update utils draw sprite method to work with new Sprite class changes
* (done) just have a simple proof of concept in game.mjs for now.

## ( done 04/16/2023 ) - r35 - canvas module
* (done) start a js folder for a canvas module
* (done) start with r2 of the canvas mod that I use, but turn it into a JSM
* (done) remove threejs features that are not being used in this project
* (done) use the new canvas module to create a sprite sheet for the sun in game.mjs.

## ( done 04/16/2023 ) - r34 - Sprite sheet class
* (done) start a SpriteSheet class
* (done) a sprite sheet can an image that is an Image or Canvas
* (done) a cell data array should be one of the properties that is used to define where all the cells are in the sheet
* (done) the Sprite class can contain a ref to a SpriteSheet
* (done) a Sprite should have a current cell index value
* (done) have a SpriteSheet.setCellDataToGrid method that will just set the cell data to a given grid
* (done) SpriteSheet.getCell method
* (done) create and add a simple test sprite shet
* (done) update the utils.drawSprite method to use a sheet if there is one uisng cellData and Sprite methods

## ( done 04/15/2023 ) - r33 - Sprite class started
* (done) start a Sprite class that extends Object2d
* (done) have a utils.drawSprite method

## ( done 04/15/2023 ) - r32 - start object2d class
* (done) start a base object2d lib based on the Object3d lib of threejs
* (done) have a constructor worked out
* (done) just position value for now

## ( done 04/15/2023 ) - r31 - vector2 folder
* (done) I would like to have a Vector2 js folder 
* (done) see about fixing problem with reloading clearing the autosave file
* (done) use vector2 for the sun position
* (done) see about using vector2 for the center pos

## ( done 04/14/2023 ) - r30 - Save and Load games
* (done) I will need a preload.js auto load method for loading game saves
* (done) have an MS.auto_save method
* (done) auto_save on every game tick
* (done) just save and load a text file in the home folder

## ( done 04/14/2023 ) - r29 - lzstring
* (done) add lzsting as part of the stack, and make a MJS form of the file
* (done) use lzsrting to make a compressed save string when calling gameMod.createSaveString
* (done) update gameMod.parseSaveString to use lzstring to decompress the save string

## ( done 04/13/2023 ) - r28 - gameMod.createSaveString
* (done) Lands.getSectionDataArray that will create the array of data objects that I need
* (done) start gameMod.createSaveString method
* (done) a mana value will need to be stored
* (done) mana level will need to be stored
* (done) sun pos should be stored
* (done) have a gameMod.parseSaveString method that converts a save string to gameMod.create options

## ( done 04/13/2023 ) - r27 - LandSection.getSectionData
* (done) fixed a debit mana bug when upgrading a block
* (done) create an LandSection.applySectionData method
* (done) start a LandSection.getSectionData method that will return an sectionData object

## ( done 04/13/2023 ) - r26 - block data for Land Sections
* (done) block info disp can be set on or off.
* (done) no block info disp for world state
* (done) I will want to have a way to define what the start points are for blocks

## ( done 04/13/2023 ) - r25 - Slot unlock data for Lands
* (done) started a constant.LANDS\_START\_SECTION\_DATA array
* (done) use the data in LANDS\_START\_SECTION\_DATA to find out slots that are unlocked for starters

## ( done 04/13/2023 ) - r24 - Full Screen and toggle dev tools menu options
* (done) full screen mode
* (done) toggle dev tools
* (done) have a MS.autoload method in preload.js

## ( done 04/13/2023 ) - r23 - user events started for gameMod
* (done) I think I should use maybe EventDispatcher ( https://threejs.org/docs/index.html#api/en/core/EventDispatcher )
* (done) have a mana-total-zero event that will happen when mana and mana per tick are zero
* (done) have a debit mana helper
* (done) check for mana-total-zero in demit mana helper
* (done) use debit mana helper gameMod.unlockSlot
* (done) use debit mana helper gameMod.createBlock
* (done) use debit mana helper gameMod.upgradeBlock

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