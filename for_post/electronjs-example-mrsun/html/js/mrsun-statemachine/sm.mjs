// sm.mjs - for electionjs-example-mrsun - The main state machine module
import { gameMod }  from "../mrsun-game/game.mjs"
import { utils }  from "../mrsun-utils/utils.mjs"
import { Vector2 } from '../vector2/vector2.mjs'
import { constant } from "../mrsun-constant/constant.mjs"
//-------- ----------
// STATE OBJECTS
//-------- ----------
import { state_init } from "./state_init.mjs";
import { state_world } from "./state_world.mjs";
import { state_land } from "./state_land.mjs";
import { state_supernova } from "./state_supernova.mjs";
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
//-------- ---------
// HELPER FUNCTIONS
//-------- ---------
const getPointerPos = (e) => {
    const canvas = e.target;
    const bx = canvas.getBoundingClientRect();
    const pos = new Vector2(e.clientX - bx.left, e.clientY - bx.top);
    pos.x = Math.floor((pos.x / canvas.scrollWidth) * canvas.width);
    pos.y = Math.floor((pos.y / canvas.scrollHeight) * canvas.height);
    return pos
};
const commonPointerAction = (sm, type, e) => {
    sm.position = getPointerPos(e);
    if(sm.currentState){
        const events = sm.currentState.events;
        if(events){
            if(events[type]){
                events[type](sm, sm.position, e, sm.currentState.data);
            }
        }
    }
};
// what to do for any keyboard action
const commonKeyboardAction = (sm, type, e) => {
    sm.keydown = type === 'keydown' ? true : false;
    let events = null;
    if(sm.currentState){
        const obj = sm.currentState.events;
        if(obj){
            events = obj;
        }
    }
    if(e.key != sm.key){
        sm.key = e.key;
        if(events.onkeyfirst){
            events.onkeyfirst(sm, sm.key, sm.keydown, e, sm.currentState.data );
        }
    }else{
        if(events.onkeyrepeat){
            events.onkeyrepeat(sm, sm.key, sm.keydown, e, sm.currentState.data );
        }
    }
    if(events.onkey){
        events.onkey(sm, sm.key, sm.keydown, e, sm.currentState.data );
    }
    
};
//-------- ---------
// PUBLIC API
//-------- ---------
const StateMachine = {};
// create and return an sm object
StateMachine.create = (opt_create) => {
    opt_create = opt_create || {};
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let container = document.body;
    if(typeof opt_create.el === 'string'){
        container = document.querySelector(opt_create.el)
    }
    if(typeof opt_create.el === 'object'){
        container = opt_create.el;
    }
    container.appendChild(canvas);
    canvas.width = 640;
    canvas.height = 480;
    const sm = {
        platform: opt_create.PLATFORM || PLATFORM_NOOP,
        canvas: canvas,
        ctx: ctx,
        game: null,
        currentStateKey: '',
        currentState: null,
        states: {},
        fps_target: 12,
        now: null,
        pointer: new Vector2(0, 0),
        keydown: false,
        key: '',
        landIndex: 0,
        ticksPerSec: 1,    // game speed is something that I think should be set here
        secs: 0,           // secs and lt are just used as a way to update game.tick count
        lt: new Date()
    };
    // Methods
    sm.setState = function(key, opt) {
        opt = opt || {};
        sm.currentStateKey = key;
        const state = sm.currentState = sm.states[sm.currentStateKey];
        state.start(sm, opt, state.data);
    };
    // APPEND STATE OBJECTS
    sm.states.init = state_init;
    sm.states.world = state_world;
    sm.states.land = state_land;
    sm.states.supernova = state_supernova;
    // POINTER EVENTS
    sm.canvas.addEventListener('pointerdown', (e) => {
        commonPointerAction(sm, 'pointerdown', e);
    });
    sm.canvas.addEventListener('pointermove', (e) => {
        commonPointerAction(sm, 'pointermove', e);
    });
    sm.canvas.addEventListener('pointerup', (e) => {
        commonPointerAction(sm, 'pointerup', e);
    });
    // document events
    // VISIBILITY CHANGE EVENT
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
    document.addEventListener("visibilitychange", (evnt) => {
        // final save on quit, or any visibilitychange event
        if(sm.game){
            gameMod.saveGame(sm.game);
        }
    });
    // WINDOW EVENTS
    // canvas resize
    const setCanvasScale = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if(w / 4 < h / 3){
            sm.canvas.style.width = w + 'px';
            sm.canvas.style.height = Math.floor(3 * w / 4) + 'px';
        }
        if(w / 4 > h / 3){
            sm.canvas.style.width = Math.floor(h / 3 * 4) + 'px';
            sm.canvas.style.height = h + 'px';
        }
    };
    setCanvasScale();
    window.addEventListener('resize', (e) => {
        setCanvasScale();
    });
    window.addEventListener('keydown', (e) => {
        commonKeyboardAction(sm, 'keydown', e);
    });
    window.addEventListener('keyup', (e) => {
        commonKeyboardAction(sm, 'keyup', e);
    });
    // MAIN APP LOOP
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
    return sm;
};
// start the state machine
StateMachine.start = (sm) => {
    Object.keys(sm.states).forEach( (stateKey) => {
        const state = sm.states[stateKey];
        if(state.init){
             state.init.call(state, sm, state.data, state)
        }
    });
    sm.setState('init', {});
    sm.loop();
};
//-------- ----------
// EXPORT
//-------- ----------
export { StateMachine };
