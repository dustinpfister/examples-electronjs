# electionjs-file-manager

The goal here is to just make a simple file manager that works the way that I like it. Also I am making this becuase it seems that all file managers crash often in raspberry pi os.

## Install

```
$ npm install
$ npm start
```

## Setting up the lanucher in Raspberry PI OS

Create a file called fm.desktop at: /home/pi/.local/share/applications where 'pi' is the current username

The Contents of the file should look like this:

```
[Desktop Entry]
Name=FM
Encoding=UTF-8
Type=Application
Name[en_US]=FM
Exec=npm start --prefix /home/pi/Documents/github/examples-electronjs/proto/electronjs-example-file-manager
Comment[en_US]=File Manager
Icon=system-file-manager
Categories=Utility;System;
StartupNotify=true
```

be surce to adjust the --prefix path to the location of the file manager project folder.
