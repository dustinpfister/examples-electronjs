# electronjs-app

This is the source code of a simple example of [app module](https://www.electronjs.org/docs/latest/api/app) features in electronjs, mainly the whenReady method, and a few other events and methods such as the getPath method of the app module. The aim here is not to create a comprehensive example of the app module mind you, but rather an example that will work okay for a post that will be a kind of getting started with the app module in electron kind of example.

So then this example will also make use of a few other features of electronjs such as the BrowserWidnoe module,a d various other modules that are used to create and call events between a main process, and a render process.

## Getting this working

with the root of this folder as the current working folder just do an npm install, and then an npm start.

```
$ npm install
$ npm start
```

## creating a project like this from an empty folder

On my old windows 10 system I am using a real old version of nodejs, as such I have run into trouble installing election as I expected. However I was able to get my main.js script running by juts making the later version of 10.x the version of election.js that I will be using for this hello world app.

```
npm install electron@10.4.7 --save-dev
```

## references

### The official API docs

[doc for latest on app module](https://www.electronjs.org/docs/latest/api/app)