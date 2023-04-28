// sm.mjs - for electionjs-example-mrsun
// Main state machine
import { gameMod }  from "../mrsun-game/game.mjs"
import { utils }  from "../mrsun-utils/utils.mjs"
import { Vector2 } from '../vector2/vector2.mjs'
import { constant } from "../mrsun-constant/constant.mjs"
//-------- ----------
// DEFAULT "NOOP" PLATFORM OBJECT
//-------- ----------
const PLATFORM_NOOP = {};
// dummy auto load
PLATFORM_NOOP.auto_load = () => {
  const err = new Error('No auto load feature with this dummy MS API');
  return Promise.reject(err)
};
PLATFORM_NOOP.auto_save = () => {
    const err = new Error('No auto save feature with this dummy MS API');
    return Promise.reject(err);
};
PLATFORM_NOOP.log = (mess) => {};
//-------- ----------
// CREATE MAIN sm OBJECT
//-------- ----------
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('wrap_main') || document.body;
container.appendChild(canvas);
canvas.width = 640;
canvas.height = 480;
const sm = window.sm = {
   platform: window.PLATFORM || PLATFORM_NOOP,
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
import { state_init } from "./state_init.mjs";
sm.states.init = state_init;
//-------- ----------
// world state
//-------- ----------
import { state_world } from "./state_world.mjs";
sm.states.world = state_world;
//-------- ----------
// land state
//-------- ----------
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
                utils.button_check(data, 'button_back', pos, () => {
                    sm.setState('world', {});
                });
                utils.button_check(data, 'button_next', pos, () => {
                    sm.landIndex = (sm.landIndex + 1) % 12;
                });
                utils.button_check(data, 'button_last', pos, () => {
                    let n = sm.landIndex - 1;
                    n = n < 0 ? 11 : n;
                    sm.landIndex = n;
                });
                utils.button_check_blockmode(data, 'unlock', pos);
                utils.button_check_blockmode(data, 'create', pos);
                utils.button_check_blockmode(data, 'absorb', pos);
                utils.button_check_blockmode(data, 'upgrade', pos);
                utils.button_check_blockmode(data, 'info', pos);
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