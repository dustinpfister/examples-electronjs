// utils.js - for electionjs-example-mrsun
import { Decimal }  from "../decimal/10.4.3/decimal.mjs"
import { constant } from "../mrsun-constant/constant.mjs"
//-------- ----------
// MAIN UTILS PUBLIC OBJECT
//-------- ----------
const utils = {};
//-------- ----------
// BUTTON METHODS
//-------- ----------
// set the current button by mode string
utils.button_set = (data, mode) => {
    const key = 'button_bm_' + mode;
    const button = data[key];
    data['button_bm_' + data.block_mode].active = false;
    button.active = true;
    data.block_mode = mode;
};
utils.button_check = (data, key, pos, onClick) => {
    const button = data[key];
    if( button.position.distanceTo( pos ) <= button.r ){
        onClick(button, data, key, pos);
    }
};
utils.button_check_blockmode = (data, new_block_mode, pos) => {
    const key = 'button_bm_' + new_block_mode;
    utils.button_check(data, key, pos, (button) => {
        const button_bm_current = data['button_bm_' + data.block_mode];
        if(button_bm_current === button){
            console.log('block mode button all ready selected.');
            if(button.options){
                console.log('we have options though. I can step that.');
                button.i_option += 1;
                button.i_option %= button.options.length;
            }
        }
        if(button_bm_current != button){
            console.log('block mode switch');
            button_bm_current.active = false;
            button.active = true;
            data.block_mode = new_block_mode;
        }
    });
};
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
            return n.toString();
        }
        const er = n.e % 3;
        const i_name = Math.floor( n.e / 3 ) - 1;
        const a = parseFloat( n.toExponential(dp, Decimal.ROUND_DOWN).split('e')[0] );
        if(i_name < NAMES.length){
            let dp2 = dp - er;
            dp2 = dp2 < 0 ? 0: dp2;
            return (a * Math.pow( 10, er ) ).toFixed( dp2 ) + '' + NAMES[i_name];
        }
        return n.toExponential(dp);
    };
}());
// add up pows from start exp down to zero
utils.addPows = (base, exp_start, exp_end) => {
    exp_end = exp_end === undefined ? 0 : exp_end;
    let e = exp_start;
    let n = 0;
    while(e >= exp_end){
        const p = Math.pow(base, e);
        n += p;
        e -= 1;
    }
    return n;
};
//-------- ----------
// RENDER UTILIES
//-------- ----------
// draw a button
utils.drawButton = ( sm, button, ctx, canvas ) => {
    ctx.fillStyle = button.active ? '#004400' : '#444444';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(button.position.x, button.position.y, button.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // desc
    ctx.fillStyle = 'white';
    ctx.font = '12px arial';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(button.desc || 'foo', button.position.x, button.position.y);
    // if options draw text for current option
    if(button.options){
        ctx.font = '10px arial';
        const str = button.options[button.i_option];
        ctx.fillText(str, button.position.x, button.position.y + 14);
    }
};
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
    ctx.fillStyle = 'white';
    ctx.font = '15px arial';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    // mana bar
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(10, 4, 250, 17);
    ctx.fillStyle = '#0044dd';
    const a_mana = sm.game.mana.div(sm.game.mana_cap);
    ctx.fillRect(10, 4, 250 * a_mana, 17);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('mana: ' + utils.formatDecimal(sm.game.mana, 2) + ' / ' +
         utils.formatDecimal(sm.game.mana_cap, 2) + 
         ' (+' + utils.formatDecimal(sm.game.mana_per_tick, 4) + ') ', 15, 5);
    // sunspots count
    ctx.fillStyle = '#888888';
    ctx.fillText('sunspots: ' + utils.formatDecimal( sm.game.sunspots, 2 ) + ' (' + sm.game.sunspot_multi.toFixed(2) + 'X)', 275, 5);
    // tick count
    ctx.fillText('tick: ' + sm.game.tick, 10, 25);
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
    while(i < constant.SLOT_GRID_LEN){
        const bx = i % constant.SLOT_GRID_WIDTH;
        const by = Math.floor(i / constant.SLOT_GRID_WIDTH);
        const i_slot = by * constant.SLOT_GRID_WIDTH + bx;
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
        //ctx.fill();
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
// FORMAT DECIMAL TEST
//-------- ----------
/*
const total = 960;
let unlock_count = 0;
while(unlock_count < total){
    const n = Decimal.pow(10, 30 * ( unlock_count / total ) ).ceil().sub(1);
    console.log( unlock_count, utils.formatDecimal(n, 2), n.toExponential(8) );
    unlock_count += 1;
}
*/
//-------- ----------
// EXPORT
//-------- ----------
export { utils };