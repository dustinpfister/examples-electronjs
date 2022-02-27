# electionjs-app-video-ground todo list

## Known problems
* #0 - I have to disable CSP to get vuejs to work in the html files that I use in the html folder
* #1 - I am using eval to run javaScript code in the textarea element in html/js/client.js
* #2 - when I reload from dev tools some times the video loads other times it does not in windows
* #3 - textures for dea files do not show up until frame+ or frame- is clicked

## () - r2 - new video API system with sequences
* set 0.2.0 for package.json
<!-- Work out a standard for making a video -->
* start a new system for making a video based on what I all ready have working for the videos in test threejs

## () - r1 - DAE Files
* (done) set 0.1.0 for version in package.json
* (done) load a dea file result
* (done) use the dae result in a start video

* (done) no state object, just have an sm object and pass that to calls of VIDEO.update in client.js
* the sm object should be there to work with in calls of VIDEO.init also
* updating all init methods of all start video examples so that sm is the first argument of a VIDEO.init call

* can load more than one DAE file
* (done) make sure dae files with textures load okay

* see about fixing bug #3


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

