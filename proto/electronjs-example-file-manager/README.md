# electionjs-file-manager

The goal here is to just make a simple file manager that works the way that I like it. Also I am making this because it seems that all file managers crash often in raspberry pi os.

## Install

```
$ npm install
$ npm start
```

## Giving up on windows support ( for now )

I have to give up with Windows support for now because of a major time consuming problem trying to read the contents of folders that have spaces in windows. I thought that I was running into a problem with

## Setting up the launcher in Raspberry PI OS

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

be sure to adjust the --prefix path to the location of the file manager project folder.

## Spawn detached!

had a hard time getting my start.sh files to work but I was able to get it working by making a detached span and what as really getting in the way was not setting the cwd option of the spawn


## Linux file command, cut command, and default applactions or actions for items

The file command can be used with the -i option to get mime type info. This can then be piped to the linux cut command to get the desired end result. This mime type info can then be used to lanuch an applaction that is set for that mime type such as text/html.

```
$ file -i text.txt | cut -d " " -f 2
text/html;
```

There is also working out a pure javaScript solutin for this, but at this time I am not interested in getting this to work on Windows.
