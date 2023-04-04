// utils.js - r0 - for electionjs-example-mrsun
const utils = {};
//-------- ----------
// MATH UTILIES
//-------- ----------
// distance
utils.distance = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};
// bounding box
utils.boundingBox = function (x1, y1, w1, h1, x2, y2, w2, h2) {
    return !(
        (y1 + h1) < y2 ||
        y1 > (y2 + h2) ||
        (x1 + w1) < x2 ||
        x1 > (x2 + w2));
};
//-------- ----------
// RENDER UTILIES
//-------- ----------
// draw a common display that you would want to have over all states
utils.drawCommonDisp = (sm, ctx, canvas) => {
    ctx.fillStyle = 'white';
    ctx.font = '15px arial';
    ctx.textBaseline = 'top';
    ctx.fillText('mana: ' + sm.game.mana, 10, 10);
    ctx.fillText('tick: ' + sm.game.tick, 10, 25);
};