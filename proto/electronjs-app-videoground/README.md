# electionjs-app-videoground

This is an idea for an electron.js applaction that I am calling videoground which is a play on the words 'video', and 'playground'. In orther words the main goal with this porject is to just simply have fun with electronjs, threejs, vuejs, my own vanilla javaScript, code and any addtional assets to create an applaction where the content that is to be created is a video project.

## What the goals are with this project

* to start out at least with a standard for video file projects that works as well as what I have in my test threejs project
* export as images so that ffmped can be used to create a video that way

## Cretaing a video from frame images with ffmpeg

If I have a folder of png files in the range of 'frame-0000.png' to 'frame-9999.png', then using ffmpeg with the -i option should work with the value 'frame-%04d.png'. I will then want to add any addtional options such as setting the framerate, and of course I will want to give an output file

```
$ ffmpeg -framerate 30 -i frame-%04d.png output.mp4
```

## Getting this working

with the root of this folder as the current working folder just do an npm install, and then an npm start.

```
$ npm install
$ npm start
```

