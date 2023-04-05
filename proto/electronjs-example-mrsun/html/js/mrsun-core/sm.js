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

//canvas.style.width = '100%';
//canvas.style.height = '100%';

const sm = {
   canvas: canvas,
   ctx: ctx,
   game: null,
   currentStateKey: '',
   currentState: null,
   states: {},
   fps_target: 30,
   now: null,
   x:0, y:0,
   landIndex: 0,
   ticksPerSec: 1,    // game speed is soemthing that I think should be set here
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
       gameMod.updateByTickDelta(sm.game, sm.ticksPerSec * secs);
    },
    render: (sm, ctx, canvas) => {
        const sun = sm.game.sun;
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0, canvas.width, canvas.height);
        // max dist circle
        const md = sm.game.SUNAREA_RADIUS;
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
        sm.game.lands.forEach((land) => {
            ctx.fillStyle = 'brown';
            ctx.beginPath();
            ctx.arc(land.x, land.y, land.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText(land.temp, land.x, land.y);
        });
        // disp
        utils.drawCommonDisp(sm, ctx, canvas);
    },
    events: {
        pointerdown : (sm, x, y, e) => {
            const sun = sm.game.sun;
            const d = utils.distance(x, y, sun.cx, sun.cy);
            // clicked in the sun area?
            if(d < sm.game.SUNAREA_RADIUS){
                gameMod.setSunPos(sm.game, x, y);
                return;
            }
            // clicked land object?
            const land = gameMod.getLandByPos(sm.game, x, y);
            if(land){
                sm.landIndex = land.i;
                sm.setState('land', {});
                return;
            }
            console.log('Whole lot of nothing here');
        }
    }
};
//-------- ----------
// land state
//-------- ----------
sm.states.land = {
    data: {
        button_back : {  x: 600, y: 38, r: 32 },
        button_next : {  x: 606, y: 240, r: 24 },
        button_last : {  x: 34, y: 240, r: 24 },
        grid_sx: 320 - 50 * 5,
        grid_sy: 100,
        gw: 32, gh:32,
        block_width: 50,
        block_height: 35
    },
    start: (sm, opt, data) => {
        data.gw = data.block_width * sm.game.BLOCK_GRID_WIDTH;
        data.gh = data.block_height * sm.game.BLOCK_GRID_HEIGHT;
    },
    update: (sm, secs, data) => {
        gameMod.updateByTickDelta(sm.game, sm.ticksPerSec * secs);
    },
    render: (sm, ctx, canvas, data) => {
        const sun = sm.game.sun;
        const land = sm.game.lands[sm.landIndex];
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0, canvas.width, canvas.height);
        // buttons
        utils.drawButton(sm, data.button_back, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_next, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_last, sm.ctx, sm.canvas);
        // render blocks
        let i = 0;
        const sx = data.grid_sx, sy = data.grid_sy;
        while(i < sm.game.BLOCK_GRID_LEN){
            const bx = i % sm.game.BLOCK_GRID_WIDTH;
            const by = Math.floor(i / sm.game.BLOCK_GRID_WIDTH);
            const i_block = by * sm.game.BLOCK_GRID_WIDTH + bx;
            const block = land.blocks[i_block];
            ctx.fillStyle = block.type === 'blank' ? 'black' : 'red';
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.rect(sx + data.block_width * bx, sy + data.block_height * by, data.block_width, data.block_height);
            ctx.fill();
            ctx.stroke();
            i += 1;
        }
        // disp
        utils.drawCommonDisp(sm, ctx, canvas);
        ctx.fillText('temp: ' + land.temp, 10, 40);
        ctx.fillText('rocks: ' + land.rock_count, 10, 55);
        ctx.fillText('block cost: ' + land.rock_cost, 10, 70);
    },
    events: {
        pointerdown : (sm, x, y, e, data) => {
            const land = sm.game.lands[sm.landIndex];
            // back button
            let button = data.button_back;
            if( utils.distance(button.x, button.y, x, y) <= button.r ){
                sm.setState('world', {});
            }
            // next and last buttons
            button = data.button_next;
            if( utils.distance(button.x, button.y, x, y) <= button.r ){
                console.log('next');
                sm.landIndex = (sm.landIndex + 1) % 12;
                console.log(sm.landIndex);
            }
            button = data.button_last;
            if( utils.distance(button.x, button.y, x, y) <= button.r ){
                let n = sm.landIndex - 1;
                n = n < 0 ? 11 : n;
                sm.landIndex = n;
                console.log('last');
            }
            // grid clicked?
            if( utils.boundingBox(x, y, 1, 1, data.grid_sx, data.grid_sy, data.gw, data.gh) ){
                const bx = Math.floor( ( x - data.grid_sx - 0.01) / data.block_width );
                const by = Math.floor( ( y - data.grid_sy - 0.01) / data.block_height );
                const i = by * sm.game.BLOCK_GRID_WIDTH + bx;
                const block = land.blocks[i];
                gameMod.buyBlock(sm.game, sm.landIndex, i);
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
    const pos = {
        x: e.clientX - bx.left,
        y: e.clientY - bx.top
    };
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
            events[type](sm, sm.x, sm.y, e, sm.currentState.data);
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
       const data = state.data;
       state.update(sm, sm.secs, data);
       state.render(sm, sm.ctx, sm.canvas, data);
       sm.lt = sm.now;
    }
};
sm.loop();