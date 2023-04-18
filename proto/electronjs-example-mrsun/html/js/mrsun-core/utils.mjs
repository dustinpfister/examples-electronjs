// utils.js - for electionjs-example-mrsun
const utils = {};
//-------- ----------
// MATH UTILIES
//-------- ----------
utils.logOnce = (function(){
    let count = 0;
    return (mess) => {
       if(count < 1){
           console.log(mess)
       }
       count += 1;
    };
}());
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
// add up pows from start exp down to zero
utils.addPows = (base, exp_start) => {
    let e = exp_start;
    let n = 0;
    while(e >= 0){
        const p = Math.pow(base, e);
        n += p;
        e -= 1;
    }
    return n;
};
//-------- ----------
// RENDER UTILIES
//-------- ----------
utils.drawSprite = (sprite, ctx, canvas) => {
    ctx.strokeStyle = '#00ff00';
    ctx.save();
    ctx.translate( sprite.position.x, sprite.position.y );
    if(sprite.sheets){
        let i_sheet = 0, len = sprite.sheets.length;
        while(i_sheet < len){
            const source = sprite.getCell(i_sheet);
            ctx.drawImage(sprite.sheets[i_sheet].image, 
                source.sx, source.sy, source.sw, source.sh,
                sprite.size.x / 2 * -1, sprite.size.y / 2 * -1, sprite.size.x, sprite.size.y 
            );
            i_sheet += 1;
        }
    }
    if(sprite.sheets.length === 0){
        ctx.beginPath();
        ctx.rect(sprite.size.x / 2 * -1, sprite.size.y / 2 * -1, sprite.size.x, sprite.size.y);
        ctx.stroke();
    }
    ctx.restore();
};
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
// draw a button
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
// draw the state of a given LandSection object
utils.drawLandSection = (sm, ctx, canvas, section, opt ) => {
    opt = opt || {};
    opt.block_infodisp = opt.block_infodisp || false;
    ctx.save();
    ctx.translate(opt.grid_cx , opt.grid_cy);
    ctx.rotate(opt.grid_radian);
    const sx = opt.grid_w / 2 * -1;
    const sy = opt.grid_h / 2 * -1;
    let i = 0;
    ctx.font = '10px arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    while(i < sm.game.SLOT_GRID_LEN){
        const bx = i % sm.game.SLOT_GRID_WIDTH;
        const by = Math.floor(i / sm.game.SLOT_GRID_WIDTH);
        const i_slot = by * sm.game.SLOT_GRID_WIDTH + bx;
        const slot = section.slots[i_slot];
        const block = slot.block;
        ctx.fillStyle = 'cyan';
        if(!slot.locked){
            ctx.fillStyle = block.type === 'blank' ? 'black' : 'red';
        }
        // render a block
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        const x = sx + opt.block_width * bx;
        const y = sy + opt.block_height * by;
        ctx.rect(x, y, opt.block_width, opt.block_height);
        ctx.fill();
        ctx.stroke();
        // level text
        if(block.type === 'rock' && opt.block_infodisp){
            ctx.fillStyle = 'white';
            ctx.fillText(block.level, x + 5, y + 5);
        }
        i += 1;
    }
    ctx.restore();
};
//-------- ----------
// EXPORT
//-------- ----------
export { utils };