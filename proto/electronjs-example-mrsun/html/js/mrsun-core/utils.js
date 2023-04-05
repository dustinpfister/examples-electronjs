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
    ctx.fillStyle = '#888888';
    ctx.fillRect(10, 4, 200, 17);
    ctx.fillStyle = '#0000aa';
    const a_mana = sm.game.mana / sm.game.MANA_MAX;
    ctx.fillRect(10, 4, 200 * a_mana, 17);


    ctx.fillStyle = 'white';
    ctx.font = '15px arial';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText('mana: ' + sm.game.mana + ' (+' + sm.game.mana_per_tick + ') ', 15, 5);
    ctx.fillText('tick: ' + sm.game.tick, 10, 25);
    
};
utils.drawButton = (sm, button, ctx, canvas) => {
    ctx.fillStyle = '#888888';
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(button.x, button.y, button.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
};