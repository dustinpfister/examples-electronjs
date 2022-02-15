# electionjs-browser-window

This is another basic getting started type example of electronjs, and is actually the very second electronjs application that I have made thus far following my hello world example that I started out with. The hello world example was a very striped down example where the aim was to create a simple as possible electron app where the goal is to just display hello world in a browser window, I did go a little beyond that with some things such as making a custom Menu, but for the most part I did not touch base on a lop of topics that are important when it comes to moving forward from hello world. Thus in this example the goal is to explore many more features of the BrowserWindoe class, and while doing so I will also end up expanding into many other classes and features that branch off from BrowserWindow.

## What the goals are with this example

On top of what I have all ready got working in my hello world example, in this example I would like to work out the following with the browser window class, Menu Class, and additional electron classes that are relevant to the use of BrowserWindow features.

* Create a child window from the main menu of the main window
* have a custom menu for each type of window, main and child ( BrowserWindow.prototype.setMenu )
* have more than one index.html file one for the main window, and another for one or more child windows
* have a preload script to start defining a client side api to work with
* looks like I will want to make use of contentIsolation and the ContextBridge class

## Getting this working

with the root of this folder as the current working folder just do an npm install, and then an npm start.

```
$ npm install
$ npm start
```

