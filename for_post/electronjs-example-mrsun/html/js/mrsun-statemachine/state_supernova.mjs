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
        // super nova cost object
        const snc = gameMod.getSupernovaCost(sm.game);
        // background
        render_background(sm, ctx, canvas, data);
        utils.drawButton(sm, data.button_back, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_newgame, sm.ctx, sm.canvas);
        // disp
        utils.drawCommonDisp(sm, ctx, canvas);
        const sx = 10, sy = 100, yd = 25;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = '20px monospace';
        ctx.fillText('current sunspots : ' + utils.formatDecimal(sm.game.sunspots, 4), sx, sy);
        ctx.fillText('sunspots delta   : ' + utils.formatDecimal(sm.game.sunspots_delta, 4), sx, sy + yd * 1);
        const dec = sm.game.sunspots.add( sm.game.sunspots_delta );
        const m = gameMod.getSunSpotMulti( dec.toNumber() );
        ctx.fillText('new sunspots   : ' + utils.formatDecimal(dec, 4), sx, sy + yd * 4 );
        ctx.fillText('new multiplier   : ' + m.toFixed(4) + 'x', sx, sy + yd * 5 );
        const ts = utils.formatDecimal(sm.game.mana_spent, 2)
        ctx.fillText('total mana spent   : ' + ts, sx, sy + yd * 6 );
        ctx.fillText('supernova count   : ' + sm.game.supernova_count, sx, sy + yd * 7 );
        ctx.fillText('supernova cost   : ' + utils.formatDecimal(snc.cost_dec, 2), sx, sy + yd * 8 );


    },
    events: {
        pointerdown : (sm, pos, e, data) => {
            // was the back button clicked?
            utils.button_check(data, 'button_back', pos, () => {
                sm.setState('world', {});
            });
            // was supernova button clicked?
            utils.button_check(data, 'button_newgame', pos, () => {
                const snc = gameMod.getSupernovaCost(sm.game);
                if( sm.game.mana.gte( snc.cost_dec ) ){
                    const sp = sm.game.sunspots.add(sm.game.sunspots_delta);
                    const start_date = sm.game.start_date;
                    sm.game = gameMod.create({ 
                        platform: sm.platform,
                        supernova_count: parseInt(sm.game.supernova_count) + 1,
                        sunspots: sp.toString(),
                        start_date: start_date
                    });
                    console.log('starting a new game with: ');
                    console.log( sm.game.sunspots );
                    console.log( sm.game.start_date );
                    sm.setState('world', {});
                }else{
                    console.log('not enough mana!');
                }
            });
        }
    }
};
//-------- ----------
// EXPORT
//-------- ----------
export { state_supernova };
