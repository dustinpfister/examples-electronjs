# Vector2

This is the [vector2 source code file from three.js](https://github.com/mrdoob/three.js/blob/r151/src/math/Vector2.js), I also need to add the Math Utils module as well or hack over this a little if I want the nagleTo method to work. At the time of this writing it is just the angleTo method that makes use of one method in the MathUtils module, So just adding that one method is one way to get that feature working that I might use in MrSun. I might also want to add the MathUtils module at some point as well as there are a few key methods in that module that I would like to use, but in any case I think I might like to keep this a stand alone module.

https://github.com/mrdoob/three.js/blob/r151/src/math/Vector2.js
https://github.com/mrdoob/three.js/blob/r151/src/math/MathUtils.js

## Vector2.radianTo method

There is vector2.angle, and vector2.angleTo that both do not work a certain way, so I added a raduanTo method

```js
    radianTo(v){
        const r = Math.atan2(this.y - v.y, this.x - v.x);
        return r < 0 ? Math.PI * 2 + r  : r;
    }
```

