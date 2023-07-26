# hello-world todo list

## () - JSON output text area
* () I will want textarea that will be the current JSON of the geometry
* () let the JSON be in object form rather than buffer geometry

## () - cursor position
* () view will need to store a cursor position
* () I will need ways to more the cursor position
* () can use the cursor to get a point in the current geometry

## () - three.module.js, orbit controls, view scene object
* (done) lets start with r152 of threejs as part of the client system
* (done) view will need to store the current state of a scene object
* () I will then want an update loop for this
* () I would also like to see about getting orbit controls to work with this
* () I will want a single points object as a child of the scene object

<!-- DONE -->

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