// state_land.mjs - for electionjs-example-mrsun
import { gameMod }  from "../mrsun-game/game.mjs"
import { utils }  from "../mrsun-utils/utils.mjs"
import { Vector2 } from '../vector2/vector2.mjs'
import { constant } from "../mrsun-constant/constant.mjs"
//-------- ----------
// STATE OBJECT FOR LAND
//-------- ----------
const state_land = {
    data: {
        block_mode: 'unlock',    // 'unlock', 'create', 'absorb', 'upgrade', and 'info' modes
        block_info_disp: false,  // display block info or not?
        block: null,
        button_back : {  desc: 'Back', position: new Vector2(600, 38), r: 32 },
        button_next : {  desc: 'Next', position: new Vector2(640 - 60, 430), r: 30 },
        button_last : {  desc: 'Last', position: new Vector2(60, 430), r: 30 },
        // 'Block Mode' buttons
        button_bm_unlock :  {  active: true, desc: 'Unlock', position: new Vector2(35, 125), r: 25 },
        button_bm_create :  {  active: false, desc: 'Create', position: new Vector2(35, 180), r: 25 },
        button_bm_absorb :  {  active: false, desc: 'Absorb', position: new Vector2(35, 235), r: 25 },
        button_bm_upgrade : {  active: false, 
                               options: ['1x', '2x', '5x', 'mod5', 'max'],
                               i_option: 3,
                               desc: 'Upgrade',
                               position: new Vector2(35, 290), r: 25 },
        button_bm_info :    {  active: false, desc: 'Info', position: new Vector2(35, 345), r: 25 },
        grid_cx: 320,
        grid_cy: 240,
        grid_w: 0, grid_h:0,
        block_width: 50,
        block_height: 35,
        grid_radian: 0,
        block_infodisp: true
    },
    // the init hook will ONLY BE CALLED ONCE when the state machine is started
    init: (sm, data) => {
        console.log('init hook for land state');
        data.grid_w = data.block_width * constant.SLOT_GRID_WIDTH;
        data.grid_h = data.block_height * constant.SLOT_GRID_HEIGHT;
    },
    // the start hook will be called each time this state is started
    start: (sm, opt, data) => {
        console.log('land state start...');
        const lands = sm.game.lands;
        const bt_counts = sm.game.lands.bt_counts;
        utils.button_set(data, 'unlock');
        if(lands.slot_unlock_count > 0 && bt_counts.rock === 0 ){
            console.log('more than zero slots unlocked, but no rocks? So create then yes.');
            utils.button_set(data, 'create');
        }
        if(bt_counts.rock > 0){
            console.log('more than 1 rock, so upgrade then maybe.');
            utils.button_set(data, 'upgrade');
        }
    },
    // update called in main app loop function
    update: (sm, secs, data) => {
        gameMod.updateByTickDelta(sm.game, sm.ticksPerSec * secs, false);
    },
    render: (sm, ctx, canvas, data) => {
        ctx.lineWidth = 1;
        const sun = sm.game.sun;
        const section = sm.game.lands.sections[sm.landIndex];
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0, canvas.width, canvas.height);
        // the sprite object for land state
        section.sprite_land.update();
        utils.drawSprite(section.sprite_land, ctx, canvas);
        // render blocks
        //ctx.globalAlpha = 1;
        utils.drawLandSection(sm, ctx, canvas, section, data);
        //ctx.globalAlpha = 1;
        // buttons
        utils.drawButton(sm, data.button_back, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_next, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_last, sm.ctx, sm.canvas);
        utils.drawButton(sm, data.button_bm_unlock, sm.ctx, sm.canvas);
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
        ctx.fillText('section mana value: ' +  utils.formatDecimal(section.mana_total) +
                     ', sunspots delta world value: ' + sm.game.sunspots_delta_world_value + '', 15, 75);
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
            ctx.fillStyle = 'white';
            ctx.fillRect(sx, sy, 300, 200)
            ctx.font = '20px arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'black';
            ctx.fillText('type: ' + block.type, 320, sy + 20);
            ctx.fillText('mana_value: ' + utils.formatDecimal(block.mana_value.valueOf(), 4),320, sy + 40   );
            ctx.fillText('mana_base: ' + block.mana_base.toFixed(2), 320, sy + 60   );
            ctx.fillText('mana_temp: ' + block.mana_temp.toFixed(2), 320, sy + 80   );
        }
    },
    events: {
        pointerdown: (sm, pos, e, data) => {
            const section = sm.game.lands.sections[sm.landIndex];
            if(data.block_info_disp){
                data.block_info_disp = false;
            }else{
                // check buttons
                utils.button_check(data, 'button_back', pos, () => {
                    sm.setState('world', {});
                });
                utils.button_check(data, 'button_next', pos, () => {
                    sm.landIndex = (sm.landIndex + 1) % 12;
                });
                utils.button_check(data, 'button_last', pos, () => {
                    let n = sm.landIndex - 1;
                    n = n < 0 ? 11 : n;
                    sm.landIndex = n;
                });
                utils.button_check_blockmode(data, 'unlock', pos);
                utils.button_check_blockmode(data, 'create', pos);
                utils.button_check_blockmode(data, 'absorb', pos);
                utils.button_check_blockmode(data, 'upgrade', pos);
                utils.button_check_blockmode(data, 'info', pos);
                // grid clicked?
                const sx = data.grid_cx - data.grid_w / 2;
                const sy = data.grid_cy - data.grid_h / 2;
                if( utils.boundingBox(pos.x, pos.y, 1, 1, sx, sy, data.grid_w, data.grid_h) ){
                    const bx = Math.floor( ( pos.x - sx - 0.01) / data.block_width );
                    const by = Math.floor( ( pos.y - sy - 0.01) / data.block_height );
                    const i = by * constant.SLOT_GRID_WIDTH + bx;
                    const slot = section.slots[i];
                    // no slot!?
                    if(!slot){
                        console.log('no slot at this location.');
                        console.log(bx, by);
                        return;
                    }
                    const block = slot.block;
                    // action will differ based on block mode
                    if(data.block_mode === 'unlock'){
                        gameMod.unlockSlot(sm.game, sm.landIndex, i);
                    }
                    if(data.block_mode === 'create'){
                        gameMod.createBlock(sm.game, sm.landIndex, i, 1);
                    }
                    if(data.block_mode === 'absorb'){
                        gameMod.absorbBlock(sm.game, sm.landIndex, i);
                    }
                    if(data.block_mode === 'upgrade'){
                        const button = data.button_bm_upgrade;
                        if(button.i_option === 0){
                            console.log('1x upgrade');
                            gameMod.upgradeBlock(sm.game, sm.landIndex, i, 1);
                        }
                        if(button.i_option === 1){
                            console.log('2x upgrade');
                            gameMod.upgradeBlock(sm.game, sm.landIndex, i, 2);
                        }
                        if(button.i_option === 2){
                            console.log('5x upgrade');
                            gameMod.upgradeBlock(sm.game, sm.landIndex, i, 5);
                        }
                        if(button.i_option === 3){
                            console.log('mod5 upgrade');
                            gameMod.upgradeBlock(sm.game, sm.landIndex, i, 'mod5');
                        }
                        if(button.i_option === 4){
                            console.log('Max Upgrade!');
                            gameMod.upgradeBlock(sm.game, sm.landIndex, i, 'max');
                        }
                    }
                    if(data.block_mode === 'info'){
                        data.block_info_disp = true;
                        data.block = block;
                        gameMod.saveGame(sm.game);
                    }
                }
            }
        }
    }
};
//-------- ----------
// EXPORT
//-------- ----------
export { state_land };