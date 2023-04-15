import { Vector2 } from '../vector2/vector2.mjs';
import { Object2D } from './object2d.mjs';

class Sprite extends Object2D {
    constructor() {
        super();
        this.type = 'Sprite';
        // size
        const size = new Vector2();
        Object.defineProperties( this, {
            size: {
            configurable: true,
                enumerable: true,
                value: size
            }
        } );
        this.userData = {};
    }
};

export { Sprite };