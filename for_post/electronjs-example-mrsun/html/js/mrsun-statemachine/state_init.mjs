// state_init.mjs - for electionjs-example-mrsun
import { gameMod }  from "../mrsun-game/game.mjs"
import { constant } from "../mrsun-constant/constant.mjs"
//-------- ----------
// HELPER FUNCTIONS
//-------- ----------
const load_game = (sm) => {
    return sm.platform.auto_load()
    .then( (text_lz) => {
        console.log('Autoload worked, looks like we have a string to parse...');
        const opt_game = gameMod.parseSaveString(text_lz);
        sm.game = gameMod.create(Object.assign(opt_game, { platform: sm.platform }));
        gameMod.awayCheck(sm.game, sm.ticksPerSec);
        sm.setState('world', {});
    })
    .catch((e) => {
        console.log('Error with autoload. Starting new game.');
        console.log('message: ' + e.message);
        const opt_game = gameMod.parseSaveString(constant.SAVE_STRING);
        sm.game = gameMod.create(Object.assign(opt_game, { platform: sm.platform }));
        sm.setState('world', {});
    });
}
//-------- ----------
// STATE OBJECT FOR INIT
//-------- ----------
const state_init = {
    data: {
        stuck_ct: 0
    },
    start: (sm, opt) => {
       console.log('init of mr sun.');
       load_game(sm);
    },
    update: (sm, secs) => {
        const data = sm.states.init.data;
        if(!sm.game){
            data.stuck_ct += 1;
            if(data.stuck_ct >= 20){
               console.log('stuck in init state for some reason...');
               data.stuck_ct = 0;
            }else{
                //console.log(data.stuck_ct);
            }
        }
    },
    render: (sm, ctx, canvas) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0, canvas.width, canvas.height);
    }
};
//-------- ----------
// EXPORT
//-------- ----------
export { state_init };
