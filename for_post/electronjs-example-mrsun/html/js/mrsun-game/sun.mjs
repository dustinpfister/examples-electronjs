// sun.mjs - for electionjs-example-mrsun
import { Vector2 } from '../vector2/vector2.mjs'
import { canvasMod } from '../canvas/canvas.mjs'
import { Sprite, SpriteSheet } from '../object2d-sprite/sprite.mjs'
import { constant } from '../mrsun-constant/constant.mjs'
//-------- ----------
// Decimal
//-------- ----------
//Decimal.set(constant.DECIMAL_OPTIONS);
//-------- ----------
// Canvas Objects for Sun Class
//-------- ----------
const can1 = canvasMod.create({
    size: 128,
    palette: ['yellow', '#ff0000', '#880000', '#440000'],
    state: {},
    draw: (canObj, ctx, canvas, state) => {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.strokeStyle = 'black';
        let i = 0;
        const len = 16;
        const tri_count = 16;
        const radian_step = Math.PI * 2 / tri_count;
        while(i < len){
            const x = i % 4;
            const y = Math.floor(i / 4);
            const cx = 16 + 32 * x;
            const cy = 16 + 32 * y;
            // draw triangles
            let i_tri = 0;
            while(i_tri < tri_count){
               const radian = radian_step * i_tri + radian_step * 3 * (i / len);
               const x = cx + Math.cos(radian) * 16;
               const y = cy + Math.sin(radian) * 16;
               ctx.fillStyle = canObj.palette[1 + i_tri % 3];
               ctx.beginPath();
               ctx.moveTo(x, y);
               ctx.lineTo(
                   cx + Math.cos(radian - Math.PI / 180 * 12) * 10,
                   cy + Math.sin(radian - Math.PI / 180 * 12) * 10
               );
               ctx.lineTo(
                   cx + Math.cos(radian + Math.PI / 180 * 12) * 10,
                   cy + Math.sin(radian + Math.PI / 180 * 12) * 10
               );
               ctx.fill();
               i_tri += 1;
            }
            // draw base yellow circle
            ctx.beginPath();
            ctx.arc(cx, cy, 10, 0, Math.PI * 2);
            ctx.fillStyle = canObj.palette[0];
            ctx.fill();
            ctx.stroke();
            i += 1;
        }
    }
});
const can2 = canvasMod.create({
    size: 128,
    palette: ['black', 'white'],
    state: {},
    draw: (canObj, ctx, canvas, state) => {
        ctx.fillStyle = canObj.palette[0];
        ctx.strokeStyle = canObj.palette[0];
        ctx.beginPath();
        ctx.arc(13, 16, 2, 0, Math.PI * 2);
        ctx.arc(19, 16, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(12, 20);
        ctx.lineTo(14, 22);
        ctx.lineTo(18, 22);
        ctx.lineTo(20, 20);
        ctx.stroke();
    }
});
//-------- ----------
// Sun Class
//-------- ----------
class Sun extends Sprite {
    constructor () {
        super();
        this.type = 'Sun';
        const center = constant.SUN_CENTER.clone();
        Object.defineProperties( this, {
            center: {
                configurable: true,
                enumerable: true,
                value: center
            }
        });
        this.radius = constant.SUN_RADIUS;
        this.size.set(64, 64);
        const sheet1 = new SpriteSheet(can1.canvas);
        sheet1.setCellDataToGrid();
        const sheet2 = new SpriteSheet(can2.canvas);
        sheet2.setCellDataToGrid();
        this.sheets.push(sheet1);
        this.sheets.push(sheet2);
        this.cellIndices[0] = 0;
        this.cellIndices[1] = 0;
        this.centerPos();
    }
    // step the base animation forward one cell
    stepBaseAnimation () {
        let i_cell = this.cellIndices[0];
        i_cell += 1;
        i_cell = i_cell >= this.sheets[0].cell_count ? 0 : i_cell;
        this.cellIndices[0] = i_cell;
    }
    // set sun position by a given vector2 object
    setPosByVector2 (v) {
        this.position.copy(v);
        const d = this.position.distanceTo(this.center);
        const md = constant.SUNAREA_RADIUS - this.radius;
        if(d >= md){
            const a = this.position.radianTo(this.center);
            this.position.x = this.center.x + Math.cos(a) * md;
            this.position.y = this.center.y + Math.sin(a) * md;
        }
        this.zeroLengthCheck();
    }
    // 'center' th sun
    centerPos () {
        this.position.copy(this.center);
        this.zeroLengthCheck();
    }
    // check for zero vector unit length and if so set a direction
    zeroLengthCheck () {
        if(this.getLengthAlpha() === 0){
            this.position.x = this.center.x + 0.001;
        }
    }
    getLength () {
        return this.position.clone().sub(this.center).length();
    }
    getLengthAlpha(){
        const length_max = constant.SUNAREA_RADIUS - this.radius;
        return this.getLength() / length_max;
    }
    // set just the vector unit length of the sun position by way of an alpha value
    setPosLength (alpha) {
        //const a2 = 0.00001 + 0.99999 * alpha
        const length_max = constant.SUNAREA_RADIUS - this.radius;
        const v = this.position.clone().sub(this.center);
        v.setLength(length_max * alpha);
        this.position.copy(this.center).add(v);
        this.zeroLengthCheck();
    }
    setPosDir (radian) {
        const v = this.position.clone().sub(this.center);
        v.applyRadian(radian);
        this.position.copy(this.center).add(v);
        this.zeroLengthCheck();
    }
    stepLengthByIndex(index_delta, range){
        const a_lencurrent = this.getLengthAlpha();
        let len_index = Math.round( a_lencurrent * range );
        len_index = len_index + index_delta;
        len_index = len_index > range ? range : len_index;
        len_index = len_index < 0 ? 0 : len_index;
        let alpha = len_index / range;
        this.setPosLength(alpha);
    }
    stepDirByIndex(index_delta = 0, grain = 1){
        const len = constant.LAND_OBJECT_COUNT * grain;
        const dir = this.position.radianTo( this.center );
        const a = dir / ( Math.PI * 2 );
        let section_index = Math.round( a * len ) % len;
        section_index += index_delta;
        section_index %= len;
        section_index = section_index < 0 ? len - 1 : section_index;
        const radian = Math.PI * 2 / len * section_index;
        this.setPosDir(radian);
    }
};
//-------- ----------
// EXPORT
//-------- ----------
export { Sun };
