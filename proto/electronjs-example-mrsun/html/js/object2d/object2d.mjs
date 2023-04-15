// Object2d class based on the Object3d class of threejs
// https://raw.githubusercontent.com/mrdoob/three.js/r151/src/core/Object3D.js
import { Vector2 } from '../vector2/vector2.mjs';
import { EventDispatcher } from '../event-dispatcher/EventDispatcher.mjs';

class Object2D extends EventDispatcher {
    constructor() {
        super();
        this.name = '';
        this.type = 'Object3D';
        this.parent = null;
        this.children = [];
        // position
        const position = new Vector2();
        const size = new Vector2();
        Object.defineProperties( this, {
            position: {
            configurable: true,
                enumerable: true,
                value: position
            }
        } );
        this.userData = {};
    }
};

export { Object2D };