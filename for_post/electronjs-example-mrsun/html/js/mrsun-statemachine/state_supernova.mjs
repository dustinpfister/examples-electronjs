// state_supernova.mjs - for electionjs-example-mrsun
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
//-------- ----------
// STATE OBJECT FOR SUPERNOVA
//-------- ----------
const state_supernova = {
    data: {
        button_back : {  desc: 'Back', position: new Vector2(600, 38), r: 32 },
        button_newgame : {  desc: 'New Game', position: new Vector2(580, 420), r: 40 }
    },
    start: (sm, opt) => {},
    update: (sm, secs) => {
       gameMod.updateByTickDelta(sm.game, sm.ticksPerSec * secs, false);
    },
    render: (sm, ctx, canvas, data) => {
        render_background(sm, ctx, canvas, data);
        utils.drawButton(sm, data.button_back, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_newgame, sm.ctx, sm.canvas);
    },
    events: {
        pointerdown : (sm, pos, e, data) => {
            // was the back button clicked?
            utils.button_check(data, 'button_back', pos, () => {
                sm.setState('world', {});
            });
            // was supernova button clicked?
            utils.button_check(data, 'button_newgame', pos, () => {
                console.log('supernova!');
                const sp = sm.game.sunspots.add(sm.game.sunspots_delta);
                sm.game = gameMod.create({ platform: sm.platform, sunspots: sp.toString() });
                sm.setState('world', {});
            });
        }
    }
};
//-------- ----------
// EXPORT
//-------- ----------
export { state_supernova };
