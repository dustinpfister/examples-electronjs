# electionjs-app-video-ground todo list

## Known problems
* () - #0 - I have to disable CSP to get vuejs to work in the html files that I use in the html folder
* () - #1 - I am using eval to run javaScript code in the textarea element in html/js/client.js
* () - #2 - WINDOWS: when I reload from dev tools some times the video loads other times it does not in windows
* ( fixed in r1 ) - #3 - textures for dea files do not show up until frame+ or frame- is clicked
* () - #4 - WINDOWS: texture files will not load correcly in windows
* ( fixed in r2 ) - #5 - script tags keep being added each time a video is loaded

<!-- possible features  -->

## () - rx - ffmpeg bin as part of package
* I can add ffmpeg binaries as part of the over all end product and then write scripts to automate work
* I will want bins for each supported os kernal and arch (armhf and i368 Linux, and i386 Win 10)
```
https://johnvansickle.com/ffmpeg/
```
* the size of an ffmpeg bin is about 30mb, so I might want to just have one bin for each final os package

## () - rx - export menu, ffmpeg, and options
* start an export menu that will be the new home for 'export to images' in the File menu
* rename 'export to images' to just simply 'to images'
* I will want to start a 'to video' option
* the 'to video' export will still use 'to images' but will also call ffmpeg to create a video, and delete frames when done
* have an 'options' menu item that can be used to set a location for an ffmpeg bin to use


<!-- CORE IDEA  -->

## () - r4 - Sequences
<!-- sequences -->
* Start a system that involves updating the state of a scene with sequences

## () - r3 - Resolution modes, video7-13 world-positon.js
* (done) start a new canvas.js file that will contain the createCanvasObject method from guy-canvas.js
* (done) def draw method class built into the module
* (done) a def.stripes method
* (done) start a def.randomGrid methiod
* (done) color chanel range options for def.randomGrid
* (done) remove createCanvasObject method and make this file about the custom canvas textures to use with guys.js
* (done) update video6 as needed, fixing any code breaking changes
* (done) reduce spacing between arms and body
* (done) Add a moveArms method and use that in the walk method
* (done) start a new video7 start video that will make use of all features thus far
* (done) use at least one dae file in video7
* (done) use guy.js script
* (done) use guy-canvas.js
* (done) use canvas.js
* (done) tweek color range for grass
* (done) set default scene background color to black
* (done) have more than one resolution or stick to one of the youtube friendly options with this such as 640x360
* (done) have a getRatio helper in client.js and use that to set the scaled size of the canvas
* (done) start video8.js in which I am making use of raycaster to get the position on the surface of a geometry of a mesh
* (done) For this video the mesh I will have a mesh with a sphere geometry and a mesh with the box geometry
* (done) I should be able to find a way to use raycaster as a way to set the position of the box mesh to the surface of the sphere
* (done) start a world.dae file that will be a sphere like object but with mountains and vallies
* (done) start a video9 file that will be just like video8 only I will be using world.dae, and world-position.js
* (done) display current file name in title
* (done) do way with file path display in ui
<!-- video 10 -->
* (done) start video10.js start video that will be on custom geometry
* (done) create a geometry of just 6 Vertices in terms of position values, that will be two trianges then
* (done) change the position values over time
* see about adding normals, and uing the normal/depth materials
<!-- video 11 -->
* start a new video 11 based off of video 10
* this will be the same thing only now I will want to see about setting up groups for each face
* use an array of materials and set a unigue material index for each face
* change position, and material index over time
<!-- video 12 -->
* yet another videom this one based off of video 11
* this will be the same thing as video 11, but now I am loking into creating uvs for the gemetry
* Use canvas textures for the materials
* see about changing uvs over time on top of positon and material index
<!-- video 13 -->
* world.dae with texture
* apply what was learned with videos10-12 to create a new video in which I am applying textures to a world.dae file
<!-- ./html/js-ui-video-code.js -->
* I will want vm.$data.filePath, vm.$data.fileDir, and vm.$data.fileName to help address some confusion
* make it so that the the state is not updated with each key press, have a 'run' button
* start another text area that will be used as a means to display what is wrong, rtaher than using the javaScript console
<!-- world-position.js -->
* finish the world-position.js file in videoground-betaworld and make that part of the js folder hear also




## ( done 03/03/2022 ) - r2 - Scripts
* (done) set 0.2.0 for package.json
<!-- scripts -->
* (done) start a video6 start video that will be the first to use scripts
* (done) Have a VIDEO.scripts prop in video6 that is a collection of relative paths to addtional javaScript files
* (done) I will want to have a loadDAE helper function in ui-video-code that will be called first
* (done) I will then want a load scripts helper also that will be called after loadDAE
* (done) see about using this new system to load my old guy.js module
* (done) use guy model in video6.js
* (done) start a guy-canvas.js javascript file that will be used to skin a mesh with canvas elements
* (done) make changes to client so that I can load more than one script
* (done) fixed #5 by removeing all child nodes from a container div
<!-- guy-canvas.js -->
* (done) guy-canvas should create a canvas that is a sprite sheet of faces
* (done) use guy.js and guy-canvas.js in video6.js
<!-- video6.js -->
* (done) I want to have a crude cone hat for the head of the guy
* (done) draw eyes helper
* (done) red and white stripe pattern for hat
* (done) texture for grass

## ( done 02/28/2022 ) - r1 - DAE Files
* (done) set 0.1.0 for version in package.json
* (done) load a dea file result
* (done) use the dae result in a start video
* (done) no state object, just have an sm object and pass that to calls of VIDEO.update in client.js
* (done) the sm object should be there to work with in calls of VIDEO.init also
* (done) updating all init methods of all start video examples so that sm is the first argument of a VIDEO.init call
* (done) make sure dae files with textures load okay
* (done) start-videos folder location should be off of root rather than in the js folder for the client system
* (done) see about fixing bug #3
* (done) can load more than one DAE file
* (done) start video5 should just have mesh children
* (done) starting a utils.js file
* (done) I am going to want to have a method that can be used to parse out just the mesh objects from a dae result object

## ( done 02/26/2022 ) - r0 - General starting point working
* (done) have a \/html\/js folder
* (done) threejs will need to be part of the client system, go with a late version \( \/html\/js\/0.135.0\/three.min.js \)
* (done) I am also going to want to add vuejs as I like using that to make user interface controls
* (done) for now I am thinking I will just need a single browser window, with a mount point for one or more canvas elements
* (done) I started a VIDEO object standard for this project that will be the current video project
* (done) start a playback ui
* (done) playback ui should have a have frame + and - buttons
* (done) playback ui have a play-pause button
* (done) playback ui should have current frame and maxFrame text inputs
* (done) start a video js textarea ui that will be used to mutate the VIDEO object
* (done) I am going to want to have a way to load the text from video-start.js into the textarea by way of preload.js api
* (done) load the video-start.js file by way of eval / method for running javaScript
* (done) have a videoAPI.writeFrame method that takes a filePath, and canvas dataUrl for the frame
* (done) start an export to images option in the file menu that will be a folder of images for each frame
* (done) export all frames as png files so I can make a video using ffmpeg
* (done) I am going to want to pad the output file names with zeros
* (done) I am going to want a videoAPI.loadFile(path to file) method
* (done) there should be a way to start the program with a video file
* (done) must be able to adjust max frame count
* (done) start a help menu with a about option, in the about option display what the revision number is
* (done) use an input event for the textarea element to update the scene 
* (done) start a save as option
* (done) I will want to be able to save the video file code as a js file
* (done) see about reading package.json and using the minor patch number of verion for the r number in about menu

