// sm.mjs - for electionjs-example-mrsun
// Main state machine
import { gameMod }  from "../mrsun-game/game.mjs"
import { utils }  from "../mrsun-utils/utils.mjs"
import { Vector2 } from '../vector2/vector2.mjs'
import { constant } from "../mrsun-constant/constant.mjs"
//-------- ----------
// STATE OBJECT FOR WORLD 
//-------- ----------
const state_world = {
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
            utils.button_check(data, 'button_supernova', pos, () => {
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
// EXPORT
//-------- ----------
export { state_world };
