# hello-world todo list

## () - Parsing scene objects
* () see about setting scene rotation from matrix data
* () see about setting scene scale from matrix data 

## () - Built in Geometry dialog
* () have a dialog for creating a new geometry from built in geometry functions
* () be able to choose which function
* () be able to set parameters for the function

## () - file new option
* () have a file new option that will create a new start point
* () have a number of json file options to start from
* () create from built in geometry options

## () - vertex insert component
* () the push function of the cursor component show actually be part of a new vertex insert component
* () add a feature that will allow for adjusting where to insert

## () - cursor: click to set
* () have a way to set cursor state by clicking on the view canvas

## () - init and run state object files
* () I would like to break down client.js into init and run state files

## () - no window.app
* () see about doing away with window.app if it is not needed.

## () - vertex selection compoent
* () start a compoent that will have to do with vertex selection
* () this compoent can have a text input element that can be a list if indices that are selected

## () - Vertex Status Points
* () looks like I might need a vertex status points object
* () vertex status points will have depth write test set to false
* () vertex status points will be gray when not selected
* () vertex status points will be lime when selected

## () - attach pointer event helper
* () start an attach pointer events helper in client.js

<!-- DONE -->

## ( done 08/04/2023 ) - more features with json_tools
* (done) more options for json tools format scene export method
* (done) json tools load json method
* (done) start a create scene method for json tools

## ( done 08/04/2023 ) - more modules
* (done) start a cursor module
* (done) pull drag and drop code into its own module
* (done) start a JSON module

## ( done 08/04/2023 ) - some code readability and organization of client.js
* (done) refs to elements for view and json as part of state object
* (done) rename state object to app to help address confusion with sm.states and each state object in that array
* (done) ref to app as part of sm object
* (done) setting start camera position in init state rather than setup helper

## ( done 08/02/2023 ) - vertex selection
* (done) start a new scene\_3\_points.json file
* (done) I will want a state.pointer vector2 object in place of state.x, and state.y
* (done) state.raycaster, updating with point, and displaying ray state into
* (done) see about using raycaster as a way to select a point
* (done) find out why setup is being called three times
* (done) see about using ray methods and distance to method of vector3 class

## ( done 08/02/2023 ) - json replacer array format
* (done) see about working out spacing with vertexs in custom replacer.

## ( done 08/02/2023 ) - cursor: display position in view
* (done) start with a create cursor helper function
* (done) started a updateSceneFromJSON helper
* (done) material depthTest option set to false for cursor object
* (done) I will want to add a THREE.Sprite to the state.scene object for this
* (done) use canvas textures to create the texture for the cross hair
* (done) see about having a json file for this.

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