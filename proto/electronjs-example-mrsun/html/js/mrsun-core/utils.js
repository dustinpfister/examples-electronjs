// utils.js - for electionjs-example-mrsun
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
// format a decimal object
utils.formatDecimal = (function(){
    const NAMES = [ 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc' ];
    return (n, dp) => {
        dp = dp === undefined ? 2 : dp;
        if(n.e < 3){
            return n;
        }
        const er = n.e % 3;
        const i_name = Math.floor( n.e / 3 ) - 1;
        const a = parseFloat( n.toExponential(dp).split('e')[0] );
        if(i_name < NAMES.length){
            let dp2 = dp - er;
            dp2 = dp2 < 0 ? 0: dp2;
            return (a * Math.pow( 10, er ) ).toFixed( dp2 ) + ' ' + NAMES[i_name];
        }
        return n.toExponential(2);
    };
}());
//-------- ----------
// RENDER UTILIES
//-------- ----------
// draw a common display that you would want to have over all states
utils.drawCommonDisp = (sm, ctx, canvas) => {
    ctx.fillStyle = '#888888';
    ctx.fillRect(10, 4, 250, 17);
    ctx.fillStyle = '#0000aa';
    const a_mana = sm.game.mana.div(sm.game.mana_cap);
    ctx.fillRect(10, 4, 250 * a_mana, 17);
    // text
    ctx.fillStyle = 'white';
    ctx.font = '15px arial';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText('mana: ' + utils.formatDecimal(sm.game.mana) + ' / ' +
         utils.formatDecimal(sm.game.mana_cap, 0) + 
         ' (+' + utils.formatDecimal(sm.game.mana_per_tick, 4) + ') ', 15, 5);
    ctx.fillText('tick: ' + sm.game.tick, 10, 25);
    
};
utils.drawButton = (sm, button, ctx, canvas) => {
    ctx.fillStyle = button.active ? '#004400' : '#444444';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(button.x, button.y, button.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // desc
    ctx.fillStyle = 'white';
    ctx.font = '12px arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(button.desc || 'foo', button.x, button.y);
};