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
import { state_land } from "./state_land.mjs";
sm.states.land = state_land;
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