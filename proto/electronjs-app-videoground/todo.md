# electionjs-app-video-ground todo list

## () - rx - load and save
* I will want to be able to save the current state of a project
* a project will need to be some kind of archive, or a folder that follows a given format
* a project folder should have a video.js file that is the logic for the video of course
* I will want a dea folder for all models that need to be loaded for the project

## () - rx - Can add dae files to a scene
* I am going to want to be able to load in dea files for a project for sure

## () - rx - export to images
* have an export menu
* create an export to images export image that will create a folder of images

## () - r0 - General starting point working
<!-- crude start -->
* (done) have a \/html\/js folder
* (done) threejs will need to be part of the client system, go with a late version \( \/html\/js\/0.135.0\/three.min.js \)
* (done) I am also going to want to add vuejs as I like using that to make user interface controls
* (done) for now I am thinking I will just need a single browser window, with a mount point for one or more canvas elements
* (done) I started a VIDEO object standard for this project that will be the current video project

<!-- playback ui -->
* start a playback ui
* playback ui should have a have frame + and - buttons
* playback ui have a play-pause button
* playback ui should have current frame and maxFrame text inputs

<!-- VIDEO object mutate ui -->
* start a video js textarea ui that will be used to mutate the VIDEO object
* any key down event will stop the current loop if it is all ready playing
* any key up event will cuase the VIDEO object to update with the current value of the text area
