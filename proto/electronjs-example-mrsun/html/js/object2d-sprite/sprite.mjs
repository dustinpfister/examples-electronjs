import { Vector2 } from '../vector2/vector2.mjs';
import { Object2D } from '../object2d/object2d.mjs';

class SpriteSheet {
    constructor(image) {
        this.image = image || null;
        this.cell_data = [];
    }
    setToGrid(){

    }
};

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
        this.spriteSheet = null;
        this.cellIndex = 0;
        this.userData = {};
    }
};

export { Sprite, SpriteSheet };