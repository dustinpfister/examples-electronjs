// sm.js - for electionjs-example-mrsun
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
        ctx.lineWidth = 1;
        ctx.font = '15px arial';
        const sun = sm.game.sun;
        ctx.fillStyle = '#2a2a2a';
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
        // land section objects
        sm.game.lands.sections.forEach((section, i) => {
            utils.drawLandSection(sm, ctx, canvas, section, {
                grid_cx: section.x,
                grid_cy: section.y,
                grid_w: 80, grid_h:50,
                block_width: 80 / 10,
                block_height: 50 / 8,
                grid_radian: Math.PI * 2 / 12 * i + Math.PI * 0.5});
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.beginPath();
            ctx.arc(section.x, section.y, section.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'white';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText(section.temp, section.x, section.y);
        });
        // disp
        utils.drawCommonDisp(sm, ctx, canvas);
        // world disp
        ctx.font = '10px arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('rocks: ' + sm.game.lands.bt_counts.rock, 15, 45);
        ctx.fillText('slots unlocked: ' + sm.game.lands.slot_unlock_count + '/' + sm.game.lands.slot_total, 15, 55);
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
            const land = gameMod.getSectionByPos(sm.game, x, y);
            if(land){
                sm.landIndex = land.i;
                sm.setState('land', {});
                return;
            }
        }
    }
};
//-------- ----------
// land state
//-------- ----------
const button_check = (data, key, x, y, onClick) => {
    const button = data[key];
    if( utils.distance(button.x, button.y, x, y) <= button.r ){
        onClick(button, data, key, x, y);
    }
};
const button_check_blockmode = (data, new_block_mode, x, y) => {
    const key = 'button_bm_' + new_block_mode;
    button_check(data, key, x, y, (button) => {
        data['button_bm_' + data.block_mode].active = false;
        button.active = true;
        data.block_mode = new_block_mode;
    });
};
sm.states.land = {
    data: {
        block_mode: 'create',    // 'create', 'absorb', 'upgrade', and 'info' modes
        block_info_disp: false,  // display block info or not?
        block: null,
        button_back : {  desc: 'Back', x: 600, y: 38, r: 32 },
        button_next : {  desc: 'Next', x: 640 - 60, y: 430, r: 30 },
        button_last : {  desc: 'Last', x: 60, y: 430, r: 30 },
        button_bm_create :  {  active: true, desc: 'Create', x: 35, y: 125, r: 28 },
        button_bm_absorb :  {  active: false, desc: 'Absorb', x: 35, y: 185, r: 28 },
        button_bm_upgrade : {  active: false, desc: 'Upgrade', x: 35, y: 245, r: 28 },
        button_bm_info :    {  active: false, desc: 'Info', x: 35, y: 305, r: 28 },
        grid_cx: 320,
        grid_cy: 240,
        grid_w: 0, grid_h:0,
        block_width: 50,
        block_height: 35,
        grid_radian: 0
    },
    start: (sm, opt, data) => {
        data.grid_w = data.block_width * sm.game.SLOT_GRID_WIDTH;
        data.grid_h = data.block_height * sm.game.SLOT_GRID_HEIGHT;
    },
    update: (sm, secs, data) => {
        gameMod.updateByTickDelta(sm.game, sm.ticksPerSec * secs);
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
            ctx.fillStyle = 'white'; //(0,0, canvas.width, canvas.height);
            ctx.fillRect(sx, sy, 300, 200)
            ctx.font = '20px arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'black';
            ctx.fillText('type: ' + block.type, 320, sy + 20);
            ctx.fillText('mana_value: ' + utils.formatDecimal(block.mana_value.valueOf(), 4), 320, sy + 40   );
            ctx.fillText('mana_base: ' + block.mana_base, 320, sy + 60   );
            ctx.fillText('mana_temp: ' + block.mana_temp, 320, sy + 80   );
        }
    },
    events: {
        pointerdown : (sm, x, y, e, data) => {
            //const land = sm.game.lands[sm.landIndex];
            const section = sm.game.lands.sections[sm.landIndex];
            if(data.block_info_disp){
                data.block_info_disp = false;
            }else{
                // check buttons
                button_check(data, 'button_back', x, y, () => {
                    sm.setState('world', {});
                });
                button_check(data, 'button_next', x, y, () => {
                    sm.landIndex = (sm.landIndex + 1) % 12;
                });
                button_check(data, 'button_last', x, y, () => {
                    let n = sm.landIndex - 1;
                    n = n < 0 ? 11 : n;
                    sm.landIndex = n;
                });
                button_check_blockmode(data, 'create', x, y);
                button_check_blockmode(data, 'absorb', x, y);
                button_check_blockmode(data, 'upgrade', x, y);
                button_check_blockmode(data, 'info', x, y);
                // grid clicked?
                const sx = data.grid_cx - data.grid_w / 2;
                const sy = data.grid_cy - data.grid_h / 2;
                if( utils.boundingBox(x, y, 1, 1, sx, sy, data.grid_w, data.grid_h) ){
                    const bx = Math.floor( ( x - sx - 0.01) / data.block_width );
                    const by = Math.floor( ( y - sy - 0.01) / data.block_height );
                    const i = by * sm.game.SLOT_GRID_WIDTH + bx;
                    const slot = section.slots[i];
                    const block = slot.block;
                    // action will differ based on block mode
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
                        //console.log('mana_value: ' + block.mana_value.valueOf().toNumber());
                        //console.log(block);
                        data.block_info_disp = true;
                        data.block = block;
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