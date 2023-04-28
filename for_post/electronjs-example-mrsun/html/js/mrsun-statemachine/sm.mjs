// sm.mjs - for electionjs-example-mrsun
// Main state machine
import { gameMod }  from "../mrsun-game/game.mjs"
import { utils }  from "../mrsun-utils/utils.mjs"
import { Vector2 } from '../vector2/vector2.mjs'
import { constant } from "../mrsun-constant/constant.mjs"
// MS api check
const MS = utils.MSCheck();
//-------- ----------
// CREATE MAIN sm OBJECT
//-------- ----------
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('wrap_main') || document.body;
container.appendChild(canvas);
canvas.width = 640;
canvas.height = 480;
const sm = {
   canvas: canvas,
   ctx: ctx,
   game: null,
   currentStateKey: '',
   currentState: null,
   states: {},
   fps_target: 12,
   now: null,
   x:0, y:0,
   landIndex: 0,
   ticksPerSec: 1,    // game speed is something that I think should be set here
   secs: 0,           // secs and lt are just used as a way to update game.tick count
   lt: new Date()
};
//-------- ----------
// Methods
//-------- ----------
sm.setState = function(key, opt) {
    opt = opt || {};
    sm.currentStateKey = key;
    const state = sm.currentState = sm.states[sm.currentStateKey];
    state.start(sm, opt, state.data);
};
//-------- ----------
// init state
//-------- ----------
const load_game = () => {
    const cx = sm.canvas.width / 2;
    const cy = sm.canvas.height / 2;
    return MS.auto_load()
    .then( (text_lz) => {
        console.log('Autoload worked!');
        const opt_game = gameMod.parseSaveString(text_lz);
        sm.game = gameMod.create(Object.assign(opt_game, {cx: cx, cy: cy}));
        gameMod.awayCheck(sm.game, sm.ticksPerSec);
        sm.setState('world', {});
    })
    .catch((e) => {
        console.log('Error with autoload. Starting new game.');
        console.log('message: ' + e.message);
        const opt_game = gameMod.parseSaveString(constant.SAVE_STRING);
        sm.game = gameMod.create(Object.assign(opt_game, {cx: cx, cy: cy}));
        sm.setState('world', {});
    });
}
sm.states.init = {
    data: {
        stuck_ct: 0
    },
    start: (sm, opt) => {
       console.log('init of mr sun.');
       load_game();
    },
    update: (sm, secs) => {
        const data = sm.states.init.data;
        if(!sm.game){
            data.stuck_ct += 1;
            if(data.stuck_ct >= 20){
               console.log('stuck in init state for some reason...');
               data.stuck_ct = 0;
            }else{
                //console.log(data.stuck_ct);
            }
        }
    },
    render: (sm, ctx, canvas) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0, canvas.width, canvas.height);
    }
};
//-------- ----------
// world state
//-------- ----------
const button_check = (data, key, pos, onClick) => {
    const button = data[key];
    if( button.position.distanceTo( pos ) <= button.r ){
        onClick(button, data, key, pos);
    }
};
sm.states.world = {
    data: {
        button_supernova : {  desc: 'Supernova', position: new Vector2(580, 420), r: 40 },
    },
    start: (sm, opt) => {},
    update: (sm, secs) => {
       gameMod.updateByTickDelta(sm.game, sm.ticksPerSec * secs, false);
    },
    render: (sm, ctx, canvas, data) => {
        ctx.lineWidth = 1;
        ctx.font = '15px arial';
        const sun = sm.game.sun;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0,0, canvas.width, canvas.height);
        // max dist circle
        const md = constant.SUNAREA_RADIUS;
        ctx.fillStyle = 'cyan';
        ctx.beginPath();
        ctx.arc(sun.center.x, sun.center.y, md, 0, Math.PI * 2);
        ctx.fill();
        // sun
        ctx.fillStyle = 'rgba(255,255,0,0.5)';
        ctx.beginPath();
        ctx.arc(sun.position.x, sun.position.y, sun.radius, 0, Math.PI * 2);
        ctx.fill();
        utils.drawSprite(sun, ctx, canvas)
        // land section objects
        sm.game.lands.sections.forEach((section, i) => {
            section.sprite_world.update();
            utils.drawSprite(section.sprite_world, ctx, canvas);
            ctx.font = 'bold 30px arial';
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText(section.temp, section.position.x, section.position.y);
            ctx.strokeText(section.temp, section.position.x, section.position.y);
        });
        // disp
        utils.drawCommonDisp(sm, ctx, canvas);
        // world disp
        ctx.font = '9px monospace';
        const sx = 10, sy = 45, yd = 9;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('rocks: ' + sm.game.lands.bt_counts.rock, sx, sy);
        ctx.fillText('slots unlocked: ' + sm.game.lands.slot_unlock_count + '/' + sm.game.lands.slot_total,sx, sy + yd * 1);
        ctx.fillText('mana level: ' + sm.game.mana_level, sx, sy + yd * 2);
        ctx.fillText('world mana total: ' + utils.formatDecimal(sm.game.lands.mana_total), sx, sy + yd * 3);

        ctx.fillText('ss mana  : ' + sm.game.sunspots_delta_mana_level, sx, sy + yd * 4);
        ctx.fillText('ss value : ' + sm.game.sunspots_delta_world_value, sx, sy + yd * 5);
        ctx.fillText('ss delta : ' + sm.game.sunspots_delta, sx, sy + yd * 6);

        utils.drawButton(sm, data.button_supernova, sm.ctx, sm.canvas);

    },
    events: {
        pointerdown : (sm, pos, e, data) => {
            const sun = sm.game.sun;
            const d = pos.distanceTo(sun.center);
            // clicked in the sun area?
            if(d < constant.SUNAREA_RADIUS){
                gameMod.setSunPos(sm.game, pos);
                return;
            }
            // clicked land object?
            const land = gameMod.getSectionByPos(sm.game, pos);
            if(land){
                sm.landIndex = land.i;
                sm.setState('land', {});
                return;
            }
            // was supernova button clicked?
            button_check(data, 'button_supernova', pos, () => {
                console.log('supernova!');
                const cx = sm.canvas.width / 2;
                const cy = sm.canvas.height / 2;
                const sp = sm.game.sunspots.add(sm.game.sunspots_delta);
                sm.game = gameMod.create({cx: cx, cy: cy, sunspots: sp.toString() });
            });
        }
    }
};
//-------- ----------
// land state
//-------- ----------
const button_check_blockmode = (data, new_block_mode, pos) => {
    const key = 'button_bm_' + new_block_mode;
    button_check(data, key, pos, (button) => {
        data['button_bm_' + data.block_mode].active = false;
        button.active = true;
        data.block_mode = new_block_mode;
    });
};
sm.states.land = {
    data: {
        block_mode: 'unlock',    // 'unlock', 'create', 'absorb', 'upgrade', and 'info' modes
        block_info_disp: false,  // display block info or not?
        block: null,
        button_back : {  desc: 'Back', position: new Vector2(600, 38), r: 32 },
        button_next : {  desc: 'Next', position: new Vector2(640 - 60, 430), r: 30 },
        button_last : {  desc: 'Last', position: new Vector2(60, 430), r: 30 },
        button_bm_unlock :  {  active: true, desc: 'Unlock', position: new Vector2(35, 125), r: 25 },
        button_bm_create :  {  active: false, desc: 'Create', position: new Vector2(35, 175), r: 25 },
        button_bm_absorb :  {  active: false, desc: 'Absorb', position: new Vector2(35, 225), r: 25 },
        button_bm_upgrade : {  active: false, desc: 'Upgrade', position: new Vector2(35, 275), r: 25 },
        button_bm_info :    {  active: false, desc: 'Info', position: new Vector2(35, 325), r: 25 },
        grid_cx: 320,
        grid_cy: 240,
        grid_w: 0, grid_h:0,
        block_width: 50,
        block_height: 35,
        grid_radian: 0,
        block_infodisp: true
    },
    start: (sm, opt, data) => {
        data.grid_w = data.block_width * constant.SLOT_GRID_WIDTH;
        data.grid_h = data.block_height * constant.SLOT_GRID_HEIGHT;
    },
    update: (sm, secs, data) => {
        gameMod.updateByTickDelta(sm.game, sm.ticksPerSec * secs, false);
    },
    render: (sm, ctx, canvas, data) => {
        ctx.lineWidth = 1;
        const sun = sm.game.sun;
        const section = sm.game.lands.sections[sm.landIndex];
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0, canvas.width, canvas.height);
        // render blocks
        utils.drawLandSection(sm, ctx, canvas, section, data);
        // buttons
        utils.drawButton(sm, data.button_back, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_next, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_last, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_bm_unlock, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_bm_create, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_bm_absorb, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_bm_upgrade, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_bm_info, sm.ctx, sm.canvas);
        // common disp
        utils.drawCommonDisp(sm, ctx, canvas);
        // land disp
        ctx.font = '10px arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('temp: ' + section.temp, 15, 45);
        ctx.fillText('rocks: ' + section.bt_counts.rock, 15, 55);
        ctx.fillText('slot unlock cost: ' + utils.formatDecimal(sm.game.lands.slot_unlock_cost, 4), 15, 65);
        ctx.fillText('section mana value: ' +  utils.formatDecimal(section.mana_total) +
                     ', sunspots delta world value: ' + sm.game.sunspots_delta_world_value + '', 15, 75);
        // current land index
        ctx.font = '50px arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('LAND ' + sm.landIndex, 320, 430);
        if(data.block_info_disp){
            const sx = 320 - 150, sy = 240 - 100;
            const block = data.block;
            ctx.fillStyle = 'rgba(0,0,0, 0.5)';
            ctx.fillRect(0,0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(sx, sy, 300, 200)
            ctx.font = '20px arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'black';
            ctx.fillText('type: ' + block.type, 320, sy + 20);
            ctx.fillText('mana_value: ' + utils.formatDecimal(block.mana_value.valueOf(), 4),320, sy + 40   );
            ctx.fillText('mana_base: ' + block.mana_base.toFixed(2), 320, sy + 60   );
            ctx.fillText('mana_temp: ' + block.mana_temp.toFixed(2), 320, sy + 80   );
        }
    },
    events: {
        pointerdown: (sm, pos, e, data) => {
            const section = sm.game.lands.sections[sm.landIndex];
            if(data.block_info_disp){
                data.block_info_disp = false;
            }else{
                // check buttons
                button_check(data, 'button_back', pos, () => {
                    sm.setState('world', {});
                });
                button_check(data, 'button_next', pos, () => {
                    sm.landIndex = (sm.landIndex + 1) % 12;
                });
                button_check(data, 'button_last', pos, () => {
                    let n = sm.landIndex - 1;
                    n = n < 0 ? 11 : n;
                    sm.landIndex = n;
                });
                button_check_blockmode(data, 'unlock', pos);
                button_check_blockmode(data, 'create', pos);
                button_check_blockmode(data, 'absorb', pos);
                button_check_blockmode(data, 'upgrade', pos);
                button_check_blockmode(data, 'info', pos);
                // grid clicked?
                const sx = data.grid_cx - data.grid_w / 2;
                const sy = data.grid_cy - data.grid_h / 2;
                if( utils.boundingBox(pos.x, pos.y, 1, 1, sx, sy, data.grid_w, data.grid_h) ){
                    const bx = Math.floor( ( pos.x - sx - 0.01) / data.block_width );
                    const by = Math.floor( ( pos.y - sy - 0.01) / data.block_height );
                    const i = by * constant.SLOT_GRID_WIDTH + bx;
                    const slot = section.slots[i];
                    const block = slot.block;
                    // action will differ based on block mode
                    if(data.block_mode === 'unlock'){
                        gameMod.unlockSlot(sm.game, sm.landIndex, i);
                    }
                    if(data.block_mode === 'create'){
                        gameMod.createBlock(sm.game, sm.landIndex, i, 1);
                    }
                    if(data.block_mode === 'absorb'){
                        gameMod.absorbBlock(sm.game, sm.landIndex, i);
                    }
                    if(data.block_mode === 'upgrade'){
                        gameMod.upgradeBlock(sm.game, sm.landIndex, i);
                    }
                    if(data.block_mode === 'info'){
                        data.block_info_disp = true;
                        data.block = block;
                        gameMod.saveGame(sm.game);
                    }
                }
            }
        }
    }
};
//-------- ----------
// POINTER EVENTS
//-------- ----------
const getPointerPos = (e) => {
    const canvas = e.target;
    const bx = canvas.getBoundingClientRect();
    const pos = new Vector2(e.clientX - bx.left, e.clientY - bx.top);
    pos.x = Math.floor((pos.x / canvas.scrollWidth) * canvas.width);
    pos.y = Math.floor((pos.y / canvas.scrollHeight) * canvas.height);
    return pos
};
const commonPointerAction = (sm, type, e) => {
    const pos = getPointerPos(e);
    sm.x = pos.x;
    sm.y = pos.y;
    const events = sm.currentState.events;
    if(events){
        if(events[type]){
            events[type](sm, pos, e, sm.currentState.data);
        }
    }
}
sm.canvas.addEventListener('pointerdown', (e) => {
    commonPointerAction(sm, 'pointerdown', e);
});
sm.canvas.addEventListener('pointermove', (e) => {
    commonPointerAction(sm, 'pointermove', e);
});
sm.canvas.addEventListener('pointerup', (e) => {
    commonPointerAction(sm, 'pointerup', e);
});
//-------- ----------
// VISIBILITY CHANGE EVENT
// https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
//-------- ----------
document.addEventListener("visibilitychange", (evnt) => {
    // final save on quit, or any visibilitychange event
    gameMod.saveGame(sm.game);
});
//-------- ----------
// RESIZE EVENT
//-------- ----------
const setCanvasScale = () => {
   const w = window.innerWidth;
   const h = window.innerHeight;
   if(w / 4 < h / 3){
      canvas.style.width = w + 'px';
      canvas.style.height = Math.floor(3 * w / 4) + 'px';
   }
   if(w / 4 > h / 3){
      canvas.style.width = Math.floor(h / 3 * 4) + 'px';
      canvas.style.height = h + 'px';
   }
};
setCanvasScale();
window.addEventListener('resize', (e) => {
   setCanvasScale();
});
//-------- ----------
// MAIN APP LOOP
//-------- ----------
sm.setState('init', {});
sm.loop = () => {
    sm.now = new Date();
    sm.secs = ( sm.now - sm.lt ) / 1000;
    requestAnimationFrame(sm.loop);
    if(sm.secs > 1 / sm.fps_target){
       const state = sm.currentState;
       const data = state.data;
       state.update(sm, sm.secs, data);
       state.render(sm, sm.ctx, sm.canvas, data);
       sm.lt = sm.now;
    }
};
sm.loop();