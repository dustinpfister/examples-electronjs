import { Vector2 } from '../vector2/vector2.mjs';
import { Object2D } from '../object2d/object2d.mjs';

class SpriteSheet {
    constructor(image) {
        this.image = image || null;
        this.cell_data = [];
    }
    // set the cell data to a grid using the current image, and a given cellSize Vector2
    setCellDataToGrid( cellSize = new Vector2(32, 32) ){
        this.cell_data = [];
        let i = 0;
        const grid_w = Math.floor( this.image.width / cellSize.x );
        const grid_h = Math.floor( this.image.height / cellSize.y );
        const len = grid_w * grid_h;
        while(i < len){
            const gx = i % grid_w;
            const gy = Math.floor(i / grid_h );
            const x = gx * cellSize.x;
            const y = gy * cellSize.y;
            this.cell_data.push(x, y, cellSize.x, cellSize.y);
            i += 1;
        }
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