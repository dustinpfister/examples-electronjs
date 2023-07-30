# hello-world todo list

## () - parsing scene objects
* () see about setting scene rotation from matrix data
* () see about setting scene scale from matix data 

## () - json replacer array format
* () see about working out spacing with vertexs in custom replacer.

## () - cursor
* () view will need to store a cursor position
* () I will need ways to move the cursor position
* () can use the cursor to get a point in the current geometry

<!-- DONE -->

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