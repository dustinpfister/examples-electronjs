# electronjs-example-mrsun

With this prototype I would like to make an idle game about a little world that involves a sun, and a bunch of land section objects around this sun. The sun can then be moved to any location within this area between all the land sections, and when doing so that changes the state of the land objects with respect to a temperature value.  Each land object is composed of a grid, and the main resource which is mana can be used to unlock, create, and upgrade blocks in these grid locations. Mana is then generated by the state of these blocks by way of a base mana delta value as well as another mana value that is effected by temperature.

## Plans for Future Updates

I put a lot of time into this example so like some of my other electronjs project examples I will be continuing to work on this as a whole other project.  Once I start work on this whole other repo what I have here might end up like by video ground electronjs project example in which I will no longer maintain it.


## Core features of this prototype

This prototype features many modules, some of which I made from the ground up, others are hack jobs of some modules from various popular Projects. So far all of the borrowed code falls under the domain of the MIT license, so any full project that I make based off of this will have to be under the terms of that license as well.

* A [Vector2 class](https://github.com/dustinpfister/examples-electronjs/tree/master/for_post/electronjs-example-mrsun/html/js/vector2) that is a custom hack job of the threejs module
* The [event-dispatcher](https://github.com/dustinpfister/examples-electronjs/tree/master/for_post/electronjs-example-mrsun/html/js/event-dispatcher) module from threejs
* [decimal.js](https://github.com/dustinpfister/examples-electronjs/tree/master/for_post/electronjs-example-mrsun/html/js/decimal) for high precision math
* [ls-string.js](https://github.com/dustinpfister/examples-electronjs/tree/master/for_post/electronjs-example-mrsun/html/js/lz-string) for compressing strings for save states
* [An Object2d class](https://github.com/dustinpfister/examples-electronjs/tree/master/for_post/electronjs-example-mrsun/html/js/object2d) that is based on the Object3d class of threejs
* An [Object2d Sprite](https://github.com/dustinpfister/examples-electronjs/tree/master/for_post/electronjs-example-mrsun/html/js/object2d-sprite) class that is an extension of Object2d
* My [Canvas Module](https://github.com/dustinpfister/examples-electronjs/tree/master/for_post/electronjs-example-mrsun/html/js/canvas) that I will be hacking over as needed
* [MrSun constants](https://github.com/dustinpfister/examples-electronjs/tree/master/for_post/electronjs-example-mrsun/html/js/mrsun-constant) module
* [MrSun state machine](https://github.com/dustinpfister/examples-electronjs/tree/master/for_post/electronjs-example-mrsun/html/js/mrsun-statemachine) module
* [MrSun utilities](https://github.com/dustinpfister/examples-electronjs/tree/master/for_post/electronjs-example-mrsun/html/js/mrsun-utils) module
* [MrSun game](https://github.com/dustinpfister/examples-electronjs/tree/master/for_post/electronjs-example-mrsun/html/js/mrsun-game) module

