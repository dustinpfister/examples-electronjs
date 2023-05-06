// game.mjs - for electionjs-example-mrsun
// create and update a game state object
import { Decimal }  from '../decimal/10.4.3/decimal.mjs'
import { LZString }  from '../lz-string/1.4.4/lz-string.mjs'
import { EventDispatcher } from '../event-dispatcher/EventDispatcher.mjs'
import { Vector2 } from '../vector2/vector2.mjs'
import { canvasMod } from '../canvas/canvas.mjs'
import { Sprite, SpriteSheet } from '../object2d-sprite/sprite.mjs'
import { utils }  from '../mrsun-utils/utils.mjs'
import { constant } from '../mrsun-constant/constant.mjs'
import { Lands } from './lands.mjs'
import { Sun } from './sun.mjs'
//-------- ----------
// Decimal
//-------- ----------
Decimal.set(constant.DECIMAL_OPTIONS);
//-------- ----------
// MAIN GAME MOD OBJECT TO EXPORT
//-------- ----------
const gameMod = {};
//-------- ----------
// GAME EVENTS
//-------- ----------
const GAME_EVENTS = new EventDispatcher();
// The mana_total_zero event will fire if a player has 0 mana and 0 mana per tick income
GAME_EVENTS.addEventListener('mana_total_zero', (evnt) => {
    evnt.game.mana = evnt.game.mana.add(constant.MANA_START);
});
// autosave delay event
GAME_EVENTS.addEventListener('autosave_delay', (evnt) => {
    evnt.game.autosave_ticks = 3;
});
//-------- ----------
// HELPERS
//-------- ----------
// get the current mana cap value for a game object, or a cap value for the given level
const getManaCap = (a) => {
    let mana_level = 1;
    if(typeof a === 'number'){
       mana_level = a;
    }
    if(typeof a === 'object' && a != null){
       mana_level = a.mana_level;
    }
    if( Decimal.isDecimal(a) ){
       mana_level = a.round();
    }
    return Decimal.pow(10, 3 + (mana_level - 1) );
};
// credit a mana delta to game.mana, upgrade mana level if cap is 
// reached as long as then next cap is below MAX MANA const
const manaCredit = (game, mana_delta ) => {
    game.mana = game.mana.add( mana_delta );
    if( game.mana.gte(game.mana_cap) ){
        const new_level = game.mana_level + 1;
        const new_cap = getManaCap( new_level );
        if( new_cap.lt( constant.MANA_MAX ) ){
            game.mana_level = new_level;
            game.mana_cap = new_cap;
        }
    }
    game.mana = game.mana.gt(game.mana_cap) ?  new Decimal( game.mana_cap ) : game.mana;
};
// debit game.mana
const manaDebit = (game, mana_delta) => {
    game.mana = game.mana.sub( mana_delta );
    game.mana_spent = game.mana_spent.add(mana_delta);
    //game.mana = game.mana.lt(0) ? new Decimal(0) : game.mana;
    // test for mana and mana per tick === 0
    if( game.mana_per_tick.eq(0) && game.mana.eq(0)){
        // do an update
        gameMod.updateByTickDelta(game, 0, true);
        // if income is still 0, fire a mana_total_zero event
        if(game.mana_per_tick.eq(0)){
            GAME_EVENTS.dispatchEvent({
                type: 'mana_total_zero',
                game: game
            });
        }
    }
};
// get the base that is used to figure sunspot world value base
const getSunspotWorldValueBase = (world_mana_value) => {
    world_mana_value = world_mana_value <= 0 ? 1 : world_mana_value;
    const base_min = constant.SUNSPOTS_WORLDVALUE_BASE_MIN;
    const base_max = constant.SUNSPOTS_WORLDVALUE_BASE_MAX;
    let alpha = Math.log( world_mana_value ) / Math.log( constant.SUNSPOTS_WORLDVALUE_MAXMANA);
    alpha = alpha > 1 ? 1 : alpha;
    return base_max - (base_max - base_min) * alpha;
};
//-------- ----------
// PUBLIC API
//-------- ----------


// get the start cost of a super nova event
const getSupernovaStartcost = (supernova_count) => {
    const num = constant.SUPERNOVA_STARTCOST_NUM;
    const base = constant.SUPERNOVA_STARTCOST_BASE;
    const mp = constant.SUPERNOVA_STARTCOST_MAXPOW;
    let pow = supernova_count < mp ? supernova_count : mp;
    return num * Math.pow(base, pow);
};
// get the current supernova mana cost based on the count of supernova events,
// and an impact mana value that will reduce the current start cost
//gameMod.getSupernovaCost = ( supernova_count, impact_value ) => {
gameMod.getSupernovaCost = ( game ) => {
    const supernova_count = game.supernova_count;
    const impact_value = game.mana_spent.toNumber();
    const startcost = getSupernovaStartcost(supernova_count)
    let a_reduction = impact_value / startcost;
    a_reduction = ( a_reduction > 1 ? 1 : a_reduction);
    const cost_dec = new Decimal( Math.floor(startcost * ( 1  - a_reduction) ) );
    return {
        startcost: startcost,
        a_reduction: a_reduction,
        cost : cost_dec.toNumber(),
        cost_dec: cost_dec
    };
};
// check how much time has passed and credit any away production
gameMod.awayCheck = (game, ticks_per_sec = 1) => {
    const now = new Date();
    const secs = ( now - game.last_update ) / 1000;
    const ticks = Math.ceil(ticks_per_sec * secs);
    const mana_delta = Decimal.mul(game.mana_per_tick, ticks);
    manaCredit(game, mana_delta);
    console.log('********** Alway Check **********');
    console.log('now: ' + now);
    console.log('game.last_update: ' + game.last_update );
    console.log('secs: ' + secs);
    console.log('ticks_per_sec: ' + ticks_per_sec);
    console.log('ticks: ' + ticks);
    console.log('mana_delta: ' + utils.formatDecimal( mana_delta, 4) );
    console.log('game start date: ' + sm.game.start_date );
    console.log('game tick: ' + sm.game.tick );
    console.log('mana_spent: ' + utils.formatDecimal( game.mana_spent , 4) );
    console.log('********** *********** **********');
};

// update the game by a given tick delta
gameMod.updateByTickDelta = (game, tickDelta, force) => {
    game.tick_last = game.tick;
    game.tick_frac += tickDelta;
    game.tick = Math.floor(game.tick_frac);
    const tick_delta = game.tick - game.tick_last;
    if(tick_delta >= 1 || force){
        game.mana_per_tick = new Decimal(0);
        // update temp, block data, mana per tick, credit mana,
        game.lands.forEachSection( (section) => {
            const d_sun = section.position.distanceTo(game.sun.position);
            const d_adjusted = d_sun - section.r - game.sun.radius;
            section.d_alpha = 1 - d_adjusted / constant.SUN_DMAX;
            section.temp = constant.TEMP_MAX * section.d_alpha;
            section.temp = game.sun.getLengthAlpha() < 0.1 ? Math.ceil(section.temp): Math.round(section.temp);
            let mana_total = new Decimal(0);
            section.forEachSlot( (slot ) => {
                const a_temp = section.temp / constant.TEMP_MAX;
                const block = slot.block;
                if(!slot.locked && block.type != 'blank'){
                    // update block here
                    block.setManaStats(game.sunspot_multi);
                    const mana_delta = Math.round(block.mana_base + block.mana_temp * a_temp);
                    game.mana_per_tick = game.mana_per_tick.add( mana_delta );
                    mana_total = mana_total.add( block.mana_value.valueOf() );
                }
            });
            section.mana_total = mana_total;
        });
        // lands mana total
        let mtl = new Decimal(0);
        game.lands.forEachSection( (section) => {
            mtl =  mtl.add(section.mana_total);
        });
        game.lands.mana_total = mtl;
        // credit current mana per tick
        const mana_delta = Decimal.mul(game.mana_per_tick, tick_delta);
        manaCredit(game, mana_delta);
        // auto save check
        if(game.autosave_ticks > 0){
            game.autosave_ticks -= tick_delta;
            game.autosave_ticks = game.autosave_ticks < 0 ? 0 : game.autosave_ticks;
            if(game.autosave_ticks === 0){
                gameMod.saveGame(game);
            }
        }
    }
    // step the sun animation
    game.sun.stepBaseAnimation();
    // sunspots delta
    game.sunspots_delta_mana_level = Decimal.pow(2, game.mana_level);
    //!!! sunspot world value base (1.005 to 10 maybe? )
    //const sunspot_world_value_base = 10;
    const sunspot_world_value_base = getSunspotWorldValueBase(game.lands.mana_total.add(1));
    game.sunspots_delta_world_value = Decimal.log(game.lands.mana_total.add(1), sunspot_world_value_base).toFixed(4);
    const spd = new Decimal(0);
    game.sunspots_delta = spd.add(game.sunspots_delta_mana_level).add(game.sunspots_delta_world_value).round();
    // set last update prop used for away production
    if(!force){
        game.last_update = new Date();
    }
};
// get sunspot multi method
gameMod.getSunSpotMulti = (sunspots) => {
    return 1 + Math.log( 1 + sunspots ) / Math.log(10);
};
// create a new game state object
gameMod.create = (opt) => {
    opt = opt || {};
    opt = Object.assign({}, constant.DEFAULT_CREATE_OPTIONS, opt);
    const game = {
       start_date: opt.start_date || new Date(),
       platform: opt.platform || null,  // MUST GIVE A PLATFORM FOR gameMod.saveGame to work
       mana: new Decimal(opt.mana),
       mana_level: opt.mana_level,
       mana_cap: 0,      // set by calling getManaCap Helper
       mana_per_tick: new Decimal(0),
       mana_spent: new Decimal(opt.mana_spent),
       supernova_count: parseInt( opt.supernova_count ),
       sunspots: new Decimal(opt.sunspots),
       sunspots_delta: new Decimal(0),
       sunspots_delta_mana_level: new Decimal(0),
       sunspots_delta_world_value: new Decimal(0),
       sunspots_multi: 1,
       tick_frac: opt.tick_frac === undefined ? 0 : opt.tick_frac,
       tick: 0,           // game should update by a main tick count
       tick_last: 0,      // last tick can be subtracted from tick to get a tick delta
       last_update: opt.last_update || new Date(),
       autosave_ticks: 0 // 1 or more ticks is the number of ticks to the next game save
    };
    game.tick = Math.floor(game.tick_frac);

    // figure sunspots_multi once here in create
    game.sunspot_multi = gameMod.getSunSpotMulti( game.sunspots.toNumber() );
    // parse last_update if string
    if(typeof game.last_update === 'string'){
         game.last_update = new Date(game.last_update);
    }
    // create sun object
    game.sun = new Sun();
    const x = opt.x === undefined ? game.sun.center.x : opt.x;
    const y = opt.y === undefined ? game.sun.center.y : opt.y;
    const v2 = new Vector2(x, y);
    game.sun.setPosByVector2(v2);

    // land objects
    game.lands = new Lands({
        sectionData: opt.sectionData
    });
    game.mana_cap = getManaCap(game);
    gameMod.updateByTickDelta(game, 0, true);
    return game;
};
// set the sun position
gameMod.setSunPos = (game, pos) => {
    game.sun.setPosByVector2(pos);
    GAME_EVENTS.dispatchEvent({ type: 'autosave_delay', game: game });
};
// get land object by x, y pos or false if nothing there
gameMod.getSectionByPos = (game, pos) => {
    let i = 0;
    while(i < constant.LAND_OBJECT_COUNT){
        const section = game.lands.sections[i];
        const d = section.position.distanceTo(pos);
        if(d < section.r){
            return section;
        }
        i += 1;
    }
    return false;
};
// unlock a slot
gameMod.unlockSlot = (game, i_section, i_slot) => {
    const section = game.lands.sections[i_section];
    const slot_clicked = section.slots[i_slot];
    const x = slot_clicked.x;
    let y = constant.SLOT_GRID_HEIGHT;
    while(y--){
        const slot = section.getSlot(x, y);
        // is the block locked?
        if(slot.locked){
            if( game.mana.gte( game.lands.slot_unlock_cost ) ){
                manaDebit(game, game.lands.slot_unlock_cost);
                slot.locked = false;
                game.lands.setBlockTypeCounts();
                break;
            }
        }
    }
    GAME_EVENTS.dispatchEvent({ type: 'autosave_delay', game: game });
};
// buy a block for the given land section and slot indices
gameMod.createBlock = (game, i_section, i_slot, level) => {
    const section = game.lands.sections[i_section];
    const slot_clicked = section.slots[i_slot];
    const x = slot_clicked.x;
    let y = constant.SLOT_GRID_HEIGHT;
    while(y--){
        const slot = section.getSlot(x, y);
        // check if the unlocked slot is blank
        if(!slot.locked && slot.block.type === 'blank'){
            const block = slot.block;
            const blockCost = 1;
            gameMod.updateByTickDelta(game, 0, true);
            if(section.bt_counts.rock < constant.BLOCK_LAND_MAX){
                if(game.mana.gte( blockCost )){
                    slot.block.setLevel(level, 'rock', 1);
                    game.lands.setBlockTypeCounts();
                    manaDebit(game, blockCost);
                    GAME_EVENTS.dispatchEvent({ type: 'autosave_delay', game: game });
                }
            }
            return;
        }
    }
    console.log('all slots are locked, there is no blank slots, or there is no mana.');
};
// upgrade block
gameMod.upgradeBlock = (game, i_section, i_slot, level_delta) => {
    level_delta = level_delta === undefined ? 1 : level_delta;
    const section = game.lands.sections[i_section];
    const slot = section.slots[i_slot];
    const block = slot.block;
    if( level_delta === 'max' ){
        level_delta = block.getMaxLevel(game.mana) - block.level;
    }
    if( String(level_delta).match(/mod/)){
        const m = parseInt(level_delta.split('mod')[1]);
        level_delta =  Math.round(m - m * ( (block.level / m % m) % 1 ));
    }
    // might not need this as long as I use this method as I should
    if(typeof level_delta === 'string'){
        console.log('level delta is still a string!? that is a problem.');
        return;
    }
    let level_target = block.level + level_delta;
    const upgrade_cost = block.getUpgradeCost(block.level, level_target);
    if(slot.locked){
        console.log('slot is locked can not upgrade.');
        return;
    }
    if( game.mana.lt( upgrade_cost ) ){
        console.log( 'Not Enough mana to upgrade.' );
        console.log( 'mana: ' + game.mana.toNumber() );
        console.log( 'upgrade cost: ' + ( utils.formatDecimal( new Decimal(upgrade_cost) ) ) );
        return;
    }
    if(block.type === 'rock' && block.level < constant.BLOCK_MAX_LEVEL && game.mana.gte( upgrade_cost ) ){
        manaDebit(game, upgrade_cost );
        block.setLevel(level_target, 'rock', 1);
        GAME_EVENTS.dispatchEvent({ type: 'autosave_delay', game: game });
    }
};
// set the given land and block index back to blank, and absorb the mana value to game.mana
gameMod.absorbBlock = (game, i_section, i_slot) => {
    const section = game.lands.sections[i_section];
    const slot = section.slots[i_slot];
    const block = slot.block;
    if(slot.locked){
        return;
    }
    if(block.type != 'blank'){
        const value = block.mana_value.valueOf();
        manaCredit(game, value );
        // this kind of action will deduct from mana_spent
        game.mana_spent = game.mana_spent.sub( value );
        block.clear();
        section.dropDownBlocks(slot);
        game.lands.setBlockTypeCounts();
    }
    GAME_EVENTS.dispatchEvent({ type: 'autosave_delay', game: game });
};
// create a save string
gameMod.createSaveString = (game) => {
    const save = {};
    save.mana = game.mana.toString();
    save.mana_spent = game.mana_spent.toString();
    save.mana_level = game.mana_level;
    save.supernova_count = game.supernova_count;
    save.sunspots = game.sunspots.toString();
    save.x = game.sun.position.x;
    save.y = game.sun.position.y;
    save.sectionData = game.lands.getSectionDataArray();
    save.last_update = game.last_update;
    save.start_date = game.start_date.toString();
    save.tick_frac = game.tick_frac;
    const text_json = JSON.stringify(save);
    const text_lz = LZString.compressToBase64(text_json);
    return text_lz
};
// save game method using whatever MS.auto_save is...
gameMod.saveGame = (game) => {
    if(game.platform){
        return game.platform.auto_save( gameMod.createSaveString( game ) );
    }
    return null;
};
// parse a save string into an options object
gameMod.parseSaveString = (text_lz) => {
    if(!text_lz){
        console.log('looks like the save string is not valid!');
        return {};
    }
    const text_json = LZString.decompressFromBase64(text_lz);
    const opt = JSON.parse(text_json);
    return opt;
};
//-------- ----------
// EXPORT
//-------- ----------
export { gameMod };
