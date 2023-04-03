# electionjs-example-mrsun

## (  ) - r0 - Prototype
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
<!-- blocks and mana -->
* () add bounding box to utils
* () can click on the grid and get a block index in land state

* () 'blank', and 'rock' block types
* () first block costs 1 mana
* () once there is a block in a land section it will start to generate mana over time
* () have a base amount of 1 mana per block
* () have a temp bonus of up to 4 more mana per block based on land object distance to sun
* () the cost of the mana blocks goes up with each block

<!-- block gravity -->
* () a block placed in the grid will drop down to the floor

<!-- save state -->
* () I will need a preload.js solution for saving and loading
* () just save and load a json file in the home folder

<!-- land state - switch object buttons -->
* () have switch state object + and - buttons in land state

<!-- move sun method -->
* () have a gameMod.moveSun method that will be used in state objects such as 'world'
* () gameMod.moveSun will take an angle and distance from center