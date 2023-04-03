// sm.js - r0 - for electionjs-example-mrsun
// Main state machine
//-------- ----------
// CREATE MAIN sm OBJECT
//-------- ----------
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('wrap_main') || document.body;
container.appendChild(canvas);
canvas.width =  640;
canvas.height = 480;
const sm = {
   canvas: canvas,
   ctx: ctx,
   game: null,
   currentStateKey: '',
   currentState: null,
   states: {},
   fps_target: 30,
   now: null,
   secs: 0,
   x:0, y:0,
   lt: new Date()
};
//-------- ----------
// Methods
//-------- ----------
sm.setState = function(key, opt) {
    opt = opt || {};
    sm.currentStateKey = key;
    const state = sm.currentState = sm.states[sm.currentStateKey];
    state.start(sm, opt);
};
//-------- ----------
// init state
//-------- ----------
sm.states.init = {
    data: {},
    start: (sm, opt) => {
       const cx = sm.canvas.width / 2;
       const cy = sm.canvas.height / 2;
       sm.game = gameMod.create({
          cx: cx, cy: cy, x: cx, y: cy
       });
       sm.setState('world', {});
    },
    update: (sm, secs) => {},
    render: (sm, ctx, canvas) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0, canvas.width, canvas.height);
    }
};
//-------- ----------
// world state
//-------- ----------
sm.states.world = {
    data: {},
    start: (sm, opt) => {},
    update: (sm, secs) => {

    },
    render: (sm, ctx, canvas) => {
        const sun = sm.game.sun;
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0, canvas.width, canvas.height);
        // max dist circle
        const md = sm.game.MAX_SUN_DIST;
        ctx.fillStyle = 'cyan';
        ctx.beginPath();
        ctx.arc(sun.cx, sun.cy, md, 0, Math.PI * 2);
        ctx.fill();
        // sun
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.r, 0, Math.PI * 2);
        ctx.fill();
        // land objects
        ctx.fillStyle = 'brown';
        sm.game.lands.forEach((land) => {
            ctx.beginPath();
            ctx.arc(land.x, land.y, land.r, 0, Math.PI * 2);
            ctx.fill();
        });
    },
    events: {
        pointerdown : (sm, x, y, e) => {
            const sun = sm.game.sun;
            const d = utils.distance(x, y, sun.cx, sun.cy);
            // clicked in the sun area?
            if(d < sm.game.MAX_SUN_DIST){
                gameMod.setSunPos(sm.game, x, y);
                return;
            }
            console.log('out of sun area');
        }
    }
};
//-------- ----------
// POINTER EVENTS
//-------- ----------
const getPointerPos = (e) => {
    const bx = e.target.getBoundingClientRect();
    return {
        x: e.clientX - bx.left,
        y: e.clientY - bx.top
    };
};
const commonPointerAction = (sm, type, e) => {
    const pos = getPointerPos(e);
    sm.x = pos.x;
    sm.y = pos.y;
    const events = sm.currentState.events;
    if(events){
        if(events[type]){
            events[type](sm, sm.x, sm.y, e);
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
// MAIN APP LOOP
//-------- ----------
sm.setState('init', {});
sm.loop = () => {
    sm.now = new Date();
    sm.secs = ( sm.now - sm.lt ) / 1000;
    requestAnimationFrame(sm.loop);
    if(sm.secs > 1 / sm.fps_target){
       const state = sm.currentState;
       state.update(sm, sm.secs);
       state.render(sm, sm.ctx, sm.canvas);
       sm.lt = sm.now;
    }
};
sm.loop();