# electronjs-example-mrsun


<!-- PROTOTYPE -->

## () - rx - total spent mana value
* () have a total spent mana value as part of a game object
* () use total spent mana value as the impact value for super nova cost reduction
* () I will then want to make this total value part of a save state

## () - r84 - Vector2 object in place of sm.x, and sm.y
* () have a vector2 object as sm.pointer that will have the same values as sm.x, and sm.y
* () update all code that makes use of sm.x, y to use sm.pointer
* () remove sm.x, and sm.y

## () - r83 - supernova start condition
* () start a super nova unclock condition based on a mana impact value and number of times a supernova event happened
* () I will then want to save the number of supernova events as part of the save state
* () the impact value can then be world mana value for now

```js
const constant = {
    SUPERNOVA_STARTCOST_BASE : 2,
    SUPERNOVA_STARTCOST_MAXPOW: 40,
    SUPERNOVA_STARTCOST_NUM: 10000
};
// get the start cost of a super nova event
const get_supernova_startcost = (supernova_count) => {
    const num = constant.SUPERNOVA_STARTCOST_NUM;
    const base = constant.SUPERNOVA_STARTCOST_BASE;
    const mp = constant.SUPERNOVA_STARTCOST_MAXPOW;
    let pow = supernova_count < mp ? supernova_count : mp;
    return num * Math.pow(base, pow);
};
// get the current supernova mana cost based on the count of supernova events,
// and an impact mana value that will reduce the current start cost
const get_supernova_cost = ( supernova_count, impact_value ) => {
    const startcost = get_supernova_startcost(supernova_count)
    let a_reduction = impact_value / startcost;
    a_reduction = ( a_reduction > 1 ? 1 : a_reduction);
    return {
        startcost: startcost,
        a_reduction: a_reduction,
        cost : Math.floor(startcost * ( 1  - a_reduction) )
    };
};
get_supernova_cost(0, 0);
```

## ( done 05/04/2023 ) - r82 - game ticks, and game.start_date as part of game save
* (done) have a game.start\_date prop and make that part of the game save as well
* (done) log start date in away production message
* (done) store game tick frac as part of the save state
* (done) be sure to set both game.tick and game.tick\_frac to opt.tick in gameMod.create
* (done) log total tick count in away production message

## ( done 05/03/2023 ) - r81 - super nova state
* (done) start a whole new state for super nova
* (done) use the supernova button in world state to switch to this state
* (done) have a back button to go back to world state just like with the land state
* (done) have a start over button that will be what is clicked to cause a super nova event
* (done) display the current sunspot multi, and what it will be after super nova event

## ( done 05/03/2023 ) - r81 - set sun position with keyboard
* (done) have a Sun.setPosByVector2 method
* (done) have a Sun.setPosLengthDir method that can set vector unit length without doing anything to direction
* (done) Sun.setPosLengthDir method can also be used to set dir as well by way of optional argument
* (done) use keyboard events as a way to set sun position
* (done) I would like to use the up arrow key to set vector direction to align with the nearest lower section index
* (done) the inverse would then be nice for the down arrow key
* (done) left and right arrow keys can then be done to step vector unti length up and down by max length / 10 steps

## ( done 05/03/2023 ) - r80 - keyboard events started
* (done) start support for keyboard events by making a commonKeyboardAction helper function in sm.mjs
* (done) have a sm.keydown prop that will be set to true on keydown and back to false on keyup
* (done) have working state object keyboard events in world state

## ( done 05/02/2023 ) - r79 - Vector2 methods
* (done) remove all methods that I am not using, and am sure I will not be using any time soon with possible future revisions

## ( done 05/02/2023 ) - r78 - break down game.mjs into more files
* (done) create a lands.mjs file that will contain the Lands class as well as all the other supporting classes
* (done) constant for default Decimal settings
* (done) create a sun.mjs file that will contain the Sun class.
* (done) deleted sm old mjs file

## ( done 05/02/2023 ) - r77 - constants
* (done) have a LAND-RADIUS-TOCENTER const
* (done) use LAND-RADIUS-TOCENTER const in draw section slot methods
* (done) have a SLOT-RDAIUS-DELTA CONST
* (done) use SLOT-RADIUS-DELTA const in drawSectionSlotTexel
* (done) have a SLOT-RADIAN-DELTA and use that in drawSectionSlotTexel
* (done) have a SLOT-UNLOCK-MAXEXP const and use that in setBlockTypeCounts of Lands Class

## ( done 05/02/2023 ) - r76 - game sunspots multi property
* (done) have a sunspots multipler property in the game object
* (done) this multipler property can then just be updated once in the gameMod.create method
* (done) use this value then for the use of methods like the set mana stats block method used in the update by ticks method
* (done) use utils format decimal method to format the decimal value for sunspots
* (done) display the sunspot multiplyer

## ( done 05/01/2023 ) - r75 - Vector2 radianTo
* (done) add a Vector2.radianTo method
* (done) use the radianTo method in the setSunPos method

## ( done 05/01/2023 ) - r74 - 2x, 5x, mod5
* (done) have simple 2x, 5x, upgrade button options that are also just fixed level deltas
* (done) try out a mod5 option that will be Math.round(5 - 5 * ( (block.level / 5 % 5) % 1 )) as a way to get the level delta

## ( done 05/01/2023 ) - r73 - Max Upgrade button
* (done) I will need block mode options for having more than one option for each block mode
* (done) Clicking the upgrade button over and over again is what will change options
* (done) have a 1x option for the upgrade button that will be what I all ready have
* (done) have a max option that will be the max that can be upgraded with current mana
* (done) update gameMod.upgrade block to take a level delta argument

## ( done 04/30/2023 ) - r72 - Block.getUpgradeCost method takes target level, new getMaxLevel method
* (done) changed spacing between buttons
* (done) updated Block.getUpgradeCost method that will take a current and target level.
* (done) new Block.getMaxLevel method that will return the max level target that can be aforded with the given mana amount

## ( done 04/30/2023 ) - r71 - autosave timer
* (done) have a system where each time I upgrade, create, unlock, ect this will start a timer
* (done) have about 3 ticks secs preform a save

## ( done 04/30/2023 ) - r70 - Default start button
* (done) default start button should be unlock slot
* (done) Use the start hook of land state to check the number of unlocked slots
* (done) if unlocked slots is greater than zero, set start button to upgrade

## ( done 04/30/2023 ) - r69 - Save state fix, center x constant
* (done) fixed a bug where the game was not being saved once a supernova is done
* (done) have a constant for cx and cy used for sun center
* (done) use this new sun center const for the Sun class
* (done) use this new sun center const for the lands class
* (done) I should no longer need cx and cy options when calling the create game method

## ( done 04/29/2023 ) - r68 - new sheet rendering for Sprite Land Sections Land State class
* (done) make it so that a drawSectionSlot method can be passed when calling createSectionRenderSheet
* (done) make the draw section slot a method of each Sprite class
* (done) the draw section slot method for the SpriteLandSectionLand

## ( done 04/29/2023 ) - r67 - Sprite objects For Land Sections in Land State
* (done) I will then need a SpriteLandSectonLand class for the land state in game.mjs
* (done) use the new SpriteLandSectonLand class to create a sprite object for a section object to use in land state
* (done) draw the section sprite land object in land state

## ( done 04/29/2023 ) - r66 - init hooks for state objects
* (done) when StateMachine.start is called check for and call init methods for each state object
* (done) use init hook over start in land state

## ( done 04/29/2023 ) - r65 - break down render code in state world
* (done) break down render code in state world into a render basic and render detail function
* (done) use render detail

## ( done 04/28/2023 ) - r64 - StateMachine.create, StateMachine.start
* (done) start work on new StateMachine module by just having a StateMachine.create method that will create and return a sm object
* (done) have a StateMachine.start method that will take an sm object as an argument and start the main loop
* (done) rename main.mjs to main-electron.mjs
* (done) create an sm object with StateMachine.create in main-election.js
* (done) when calling StateMachine.create I should be able to pass a platfrom object to use

## ( done 04/28/2023 ) - r63 - state-init.mjs, state-world.mjs, state-land.mjs
* (done) pull the init state into its own mjs file as state\_init.mjs in the state machine folder
* (done) have a mjs file for the world state
* (done) add button helpers to the utils module so that I do not have to replate code in each state file that uses them
* (done) have a mjs file for the land state

## ( done 04/28/2023 ) - r62 - set mana stats Block class method in game.mjs
* (done) have a block.setManaStats method that will be used to set the various mana values
* (done) use new method in place of set by level in gameMod.updateByTickDelta

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
