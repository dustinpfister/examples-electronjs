// state_world.mjs - for electionjs-example-mrsun
import { gameMod }  from "../mrsun-game/game.mjs"
import { utils }  from "../mrsun-utils/utils.mjs"
import { Vector2 } from '../vector2/vector2.mjs'
import { constant } from "../mrsun-constant/constant.mjs"
//-------- ----------
// RENDER FUNCTIONS 
//-------- ----------
// render the background
const render_background = (sm, ctx, canvas, data) => {
    ctx.lineWidth = 1;
    ctx.font = '15px arial';
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0, canvas.width, canvas.height);
};
// render the sunarea
const render_sunarea = (sm, ctx, canvas, data) => {
    const sun = sm.game.sun;
    // sun area
    const md = constant.SUNAREA_RADIUS;
    ctx.fillStyle = 'cyan';
    ctx.beginPath();
    ctx.arc(sun.center.x, sun.center.y, md, 0, Math.PI * 2);
    ctx.fill();
    // sun back
    ctx.fillStyle = 'rgba(255,255,0,0.5)';
    ctx.beginPath();
    ctx.arc(sun.position.x, sun.position.y, sun.radius, 0, Math.PI * 2);
    ctx.fill();
};
// render the world state display
const render_display = (sm, ctx, canvas, data) => {
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
};
// render just the text for the given land section object
const render_section_text = (ctx, section) => {
    ctx.font = 'bold 30px arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(section.temp, section.position.x, section.position.y);
    ctx.strokeText(section.temp, section.position.x, section.position.y);
};
// RENDER BASIC AND DETAIL
const render_basic = (sm, ctx, canvas, data) => {
    render_background(sm, ctx, canvas, data);
    render_sunarea(sm, ctx, canvas, data);
    sm.game.lands.sections.forEach((section, i) => {
        render_section_text(ctx, section);
    });
    render_display(sm, ctx, canvas, data)
};
const render_detail = (sm, ctx, canvas, data) => {
    render_background(sm, ctx, canvas, data);
    render_sunarea(sm, ctx, canvas, data);
    utils.drawSprite(sm.game.sun, ctx, canvas);
    sm.game.lands.sections.forEach((section, i) => {
        //section.sprite_world.update();
        utils.drawSprite(section.sprite_world, ctx, canvas);
        render_section_text(ctx, section);
    });
    render_display(sm, ctx, canvas, data)
};
//-------- ----------
// STATE OBJECT FOR WORLD 
//-------- ----------
const state_world = {
    data: {
        button_supernova : {  desc: 'Supernova', position: new Vector2(580, 420), r: 40 },
    },
    start: (sm, opt) => {
        const sun = sm.game.sun;
        // as long as I do not have to update on a tick by tick basis
        // I can call the sprite_world update method here in the start hook
        sm.game.lands.sections.forEach((section, i) => {
            section.sprite_world.update();
        });
    },
    update: (sm, secs) => {
       gameMod.updateByTickDelta(sm.game, sm.ticksPerSec * secs, false);
    },
    render: (sm, ctx, canvas, data) => {
        render_detail(sm, ctx, canvas, data);
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
            utils.button_check(data, 'button_supernova', pos, () => {
                sm.setState('supernova', {});
            });
        },
        onkey: (sm, key, down, e, data) => {
            const sun = sm.game.sun;
            if(down){
                const a_lencurrent = sun.getLengthAlpha();
                if(key ==='ArrowRight'){
                    sun.stepDirByIndex(1, 1);
                }
                if(key ==='ArrowLeft'){
                    sun.stepDirByIndex(-1, 1);
                }
                if(key ==='ArrowUp'){
                    sun.stepLengthByIndex(1, 10);
                }
                if(key ==='ArrowDown'){
                    sun.stepLengthByIndex(-1, 10);
                }
                if(key.toLowerCase() ==='c'){
                    sun.centerPos();
                }
            }
        },
        onkeyfirst: (sm, key, down, e, data) => {},
        onkeyrepeat: (sm, key, down, e, data) => {}
    }
};
//-------- ----------
// EXPORT
//-------- ----------
export { state_world };
