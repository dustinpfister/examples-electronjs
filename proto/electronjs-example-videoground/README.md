# electionjs-app-videoground

This is an idea for an electron.js application that I am calling videoground, which is a play on the words 'video', and 'playground'. In other words the main goal with this project is to just simply have fun with electronjs, threejs, vuejs, my own vanilla javaScript code to make a cool project that can be used to make videos. The core idea of what I think this project should do is to just simply create a collection of png files for each frame in the video as a means of exporting, from there I can use a tool like ffmpeg to create a video file. After that when it comes to making a final product there is using addtional software tools outside of this such as audacity, MuseScore, and OpenShot to add audo and prefrom any addtional final processing type tasks.


## What the goals are with this project

* ( done in r0 ) export as images so that ffmpeg can be used to create a video that way
* ( done in r1 ) I will want to be able to load dae files, and any supporting assets in terms of textures used
* ( done in r2 ) I will want to be able to load scripts for each video file
* () I will want an videoAPI system that allows for me to define 'sequences' like that in my test vjs system


## Creating a video from frame images with ffmpeg

If I have a folder of png files in the range of 'frame-0000.png' to 'frame-9999.png', then using ffmpeg with the -i option should work with the value 'frame-%04d.png'. I will then want to add any additional options such as setting the framerate, and of course I will want to give an output file

```
$ ffmpeg -framerate 30 -i frame-%04d.png output.mp4
```

## Getting this working

with the root of this folder as the current working folder just do an npm install, and then an npm start.

```
$ npm install
$ npm start
```

