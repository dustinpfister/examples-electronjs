# electionjs-context-bridge

This is a quick example that I put together while reading up on the context bridge class in electron.js. The example is the start of a very basic text editor program that I am using to write this read me file actually. To create a basic text editor example with electronjs there are a few other features of electron.js as well as with nodejs and client side javaScript that are required. However the main focus of this example is indeed using the context bridge in a preload.js file as a way to create a public api that can be used from the window object when it comes to front end code


## What the goals are with this example

The goal of this project is to create a simple electron js example that makes use of the context bridge class in a preload.js file to create an API that can then be used in front end code to attach events that will fire when an open and save as option are used in the Menu of an electron app in the main.js file of the example. In other words it is a hello world example of the context bridge class in electron.js that goes just a few steps beyond just returning the string hello world.

## Getting this working

with the root of this folder as the current working folder just do an npm install, and then an npm start.

```
$ npm install
$ npm start
```

