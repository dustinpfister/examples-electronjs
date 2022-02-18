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
* have a \/html\/js folder
* threejs will need to be part of the client system, go with a late version \( \/html\/js\/0.135.0\/three.min.js \)
* I am also going to want to add vuejs as I like using that to make user interface controls
* for now I am thinking I will just need a single browser window, with a mount point for one or more canvas elements
* I am going to want to create some kind of system like that of the videoUI system in my test threejs folder
* start a playback ui
* playback ui should have a have frame + and - buttons
* playback ui have a play-pause button
* playback ui should have current frame and maxFrame text inputs
* start a video js textarea ui
* the video js textarea ui should be used to muttae the javaScript of just the current video