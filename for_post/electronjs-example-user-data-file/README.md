# electionjs-user-data-file

While working on r6 of my videoground applaction I have found that the API that is created as a kid of bridge between the render process and main process is a good way to make some functions that can then be called on the client side. However it is not a good way to set data values that are to be shared between both the main and renderer process. So that made me look into some other options for storing data that has to do with things like user settings, and the results of tests and so forth. One way would be to create a JSON file, or some other kind of file in the user folder and that is what this project example is about.

## Getting this working

with the root of this folder as the current working folder just do an npm install, and then an npm start.

```
$ npm install
$ npm start
```

