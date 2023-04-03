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
   fps_target: 1,
   now: null,
   secs: 0,
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
        // sun
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, 16, 0, Math.PI * 2);
        ctx.fill();
    }
};
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