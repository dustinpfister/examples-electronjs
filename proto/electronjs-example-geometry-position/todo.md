# hello-world todo list

## () - parsing scene objects
* () see about setting scene rotation from matrix data
* () see about setting scene scale from matix data 

## () - json replacer array format
* () see about working out spacing with vertexs in custom replacer.

## () - Built in Geometry dialog
* () have a dialog for creating a new geometry from built in geometry functions
* () be able to choose which function
* () be able to set parameters for the function

## () - file new option
* () have a file new option that will create a new start point
* () have a number of json file options to start from
* () create from built in geometry options

## () - cursor: click to set
* () have a way to set cursor state by clicking on the view canvas

## () - position selection
* () have a way to select one or more indices in the position attribute
* () selected points should display differently
* () have a delete function that will remove all selected points from the position attribute

## () - Layers: start layers
* () start work on some code for having more than one layer
* () I will want to have WebGlrenderer layers, and plain old 2d canvas layers
* () I think I will want to hace a cursor layer, and have that on top of the state.scene layer
* () simple 2d info layer on the top.

## () - cursor: display position in view
* (done) start with a create cursor helper function
* (done) started a updateSceneFromJSON helper
* (done) material depthTest option set to false for cursor object
* (done) I will want to add a THREE.Sprite to the state.scene object for this
* (done) use canvas textures to create the texture for the cross hair
* () see about having a json file for this.

<!-- DONE -->

## ( done 08/01/2023 ) Export Scene Object
* (done) one way to solve an issue with a lot of things might involve an 'export scene object'
* (done) export just the current object of there is one
* (done) add a grid helper on each udate then
* (done) vertex normals helper

## ( done 08/01/2023 ) - create_scene: json folder and create scene from json file
* (done) see about loading external JSON files as an option for start states in the createScene method

## ( done 08/01/2023 ) - more work on cursor
* (done) start a cursor object that at some point might need to become a module
* (done) have undefined array value be set to 0 for the input event handler

## ( done 07/31/2023 ) - cursor push function
* (done) I will need a way to know what the current geometry is by having a state.current\_object and checking that
* (done) a new position attribute should be created in the event that there is not one

## ( done 07/31/2023 ) - start the cursor
* (done) view will need to store a cursor position as an instance of Vector3 in the state object
* (done) I would like to have a ui for this where I can punch in a direct value

## ( done 07/30/2023 ) - drag and drop fix
* (done) see about getting drag and drop to work when clicking just the component div and not a child

## ( done 07/30/2023 ) - start json replacer
* (done) started work on a JSON replacer
* (done) copy the matrix when setting up scene in and see about fixing rotaiton of scene
* (done) see about setting scene position from matrix data
* (done) flat array format for now

## ( done 07/28/2023 ) - updateScene helper, better parsing of JSON
* (done) remove all children from state.scene
* (done) add children from json object to state.scene

## ( done 07/28/2023 ) - window load event, delay start of run state
* (done) see if adding an onload event for window helper with this bug that happens with the iframe not loading fast enough
* (done) update ini state to check and see if the view state object is there or not
* (done) made some progress on the drag and drop feature

## ( done 07/27/2023 ) - start drag of elements, state machine
* (done) 'component' and 'slot' class divs
* (done) added an onload event in view.js as a start for trying to fix a bug with getting the canvas
* (done) started a state machine in client.js

## ( done 07/27/2023 ) - JSON data Edit
* (done) see about having a way to parse JSON Text edits to update the Object

## ( done 07/27/2023 ) - JSON output text area
* (done) main app loop in client.js for now
* (done) I will want textarea that will be the current JSON of the geometry
* (done) let the JSON be in object form rather than buffer geometry

## ( done 07/26/2023 ) - three.module.js, orbit controls, view scene object
* (done) lets start with r152 of threejs as part of the client system
* (done) view will need to store the current state of a scene object
* (done) I will then want an update loop for this
* (done) I would also like to see about getting orbit controls to work with this

## ( done 07/25/2023 ) - more than one iframe
* (done) I am going to want more that one iframe
* (done) check to make sure content window can be used to get and set states

## ( done 07/25/2023 ) - User Input
* (done) I am going to want to interface with the iframe so lets see if user input works this way
* (done) use a canvas element
* (done) loose the scroll bars

## ( done 07/25/2023 ) - See about using iframes for threejs view
* (done) I want to see about using iframes to have a threejs view rather than what I did for videoground
* (done) sets see if I can just get a vanilla js module script tag to work

## ( done 07/25/2023 ) - start the prototype
* (done) just start the prototype folder