// Vector2 class for electionjs-example-mrsun
// Based on the source code from the Vector2 class from r151 of threejs
// https://raw.githubusercontent.com/mrdoob/three.js/r151/src/math/Vector2.js
//-------- ----------
// EXPORT
//-------- ----------
class Vector2 {
    constructor(x = 0, y = 0) {
        Vector2.prototype.isVector2 = true;
        this.x = x;
        this.y = y;
    }
    get width() {
        return this.x;
    }
    set width(value) {
        this.x = value;
    }
    get height() {
        return this.y;
    }
    set height(value) {
        this.y = value;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    add( v ) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    // apply radian method to set direction without mutation of unit length
    applyRadian(radian){
       const length = this.length();
       this.x = Math.cos(radian) * length;
       this.y = Math.sin(radian) * length;
    }
    clone() {
        return new this.constructor(this.x, this.y);
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    divideScalar( scalar ) {
        return this.multiplyScalar( 1 / scalar );
    }
    multiplyScalar( scalar ) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    normalize() {
        return this.divideScalar(this.length() || 1);
    }
    // added a radianTo method becuse the angleTo method is not working a certain way that I need it to.
    radianTo(v){
        const r = Math.atan2(this.y - v.y, this.x - v.x);
        return r < 0 ? Math.PI * 2 + r  : r;
    }
    distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v));
    }
    distanceToSquared(v) {
        const dx = this.x - v.x,
        dy = this.y - v.y;
        return dx * dx + dy * dy;
    }
    setLength(length) {
        return this.normalize().multiplyScalar(length);
    }
    sub( v ) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    length() {
        return Math.sqrt( this.x * this.x + this.y * this.y );
    }
    lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        return this;
    }

     * [Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
}
//-------- ----------
// EXPORT
//-------- ----------
export { Vector2 };
