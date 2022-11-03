# examples electionjs

This is a collection of examples on election.js that I write about in detail with my [various blog posts on electronjs here on my github pages website](https://dustinpfister.github.io/categories/electronjs/). Many of the examples are of basic features of electronjs itself with respect to the various classes to work with to make the various components of an application. Other examples are the start of full project examples including the starting prototype of my [threejs powered video project application that I am calling videoground](https://github.com/dustinpfister/videoground).


## Linux file command, cut command, and default applactions or actions for items

The file command can be used with the -i option to get mime type info. This can then be piped to the linux cut command to get the desired end result. This mime type info can then be used to lanuch an applaction that is set for that mime type such as text/html.

```
$ file -i text.txt | cut -d " " -f 2
text/html;
```

There is also working out a pure javaScript solutin for this, but at this time I am not interested in getting this to work on Windows.