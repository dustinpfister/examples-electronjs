// game.mjs - for electionjs-example-mrsun
// create and update a game state object
import { Decimal }  from "../decimal/10.4.3/decimal.mjs"
import { LZString }  from "../lz-string/1.4.4/lz-string.mjs"
import { EventDispatcher } from "../event-dispatcher/EventDispatcher.mjs"
import { Vector2 } from '../vector2/vector2.mjs'
import { canvasMod } from '../canvas/canvas.mjs'
import { Sprite, SpriteSheet } from '../object2d-sprite/sprite.mjs'
import { utils }  from "../mrsun-utils/utils.mjs"
import { constant } from "../mrsun-constant/constant.mjs"
//-------- ----------
// Canvas Objects for Sun Class
//-------- ----------
const can1 = canvasMod.create({
    size: 128,
    palette: ['yellow', '#ff0000', '#880000', '#440000'],
    state: {},
    draw: (canObj, ctx, canvas, state) => {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.strokeStyle = 'black';
        let i = 0;
        const len = 16;
        const tri_count = 16;
        const radian_step = Math.PI * 2 / tri_count;
        while(i < len){
            const x = i % 4;
            const y = Math.floor(i / 4);
            const cx = 16 + 32 * x;
            const cy = 16 + 32 * y;
            // draw triangles
            let i_tri = 0;
            while(i_tri < tri_count){
               const radian = radian_step * i_tri + radian_step * 3 * (i / len);
               const x = cx + Math.cos(radian) * 16;
               const y = cy + Math.sin(radian) * 16;
               ctx.fillStyle = canObj.palette[1 + i_tri % 3];
               ctx.beginPath();
               ctx.moveTo(x, y);
               ctx.lineTo(
                   cx + Math.cos(radian - Math.PI / 180 * 12) * 10,
                   cy + Math.sin(radian - Math.PI / 180 * 12) * 10
               );
               ctx.lineTo(
                   cx + Math.cos(radian + Math.PI / 180 * 12) * 10,
                   cy + Math.sin(radian + Math.PI / 180 * 12) * 10
               );
               ctx.fill();
               i_tri += 1;
            }
            // draw base yellow circle
            ctx.beginPath();
            ctx.arc(cx, cy, 10, 0, Math.PI * 2);
            ctx.fillStyle = canObj.palette[0];
            ctx.fill();
            ctx.stroke();
            i += 1;
        }
    }
});
const can2 = canvasMod.create({
    size: 128,
    palette: ['black', 'white'],
    state: {},
    draw: (canObj, ctx, canvas, state) => {
        ctx.fillStyle = canObj.palette[0];
        ctx.strokeStyle = canObj.palette[0];
        ctx.beginPath();
        ctx.arc(13, 16, 2, 0, Math.PI * 2);
        ctx.arc(19, 16, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(12, 20);
        ctx.lineTo(14, 22);
        ctx.lineTo(18, 22);
        ctx.lineTo(20, 20);
        ctx.stroke();
    }
});
//-------- ----------
// Sun Class
//-------- ----------
class Sun extends Sprite {
    constructor() {
        super();
        this.type = 'Sun';
        const center = constant.SUN_CENTER.clone();
        Object.defineProperties( this, {
            center: {
                configurable: true,
                enumerable: true,
                value: center
            }
        });
        this.radius = constant.SUN_RADIUS;
        this.size.set(64, 64);
        const sheet1 = new SpriteSheet(can1.canvas);
        sheet1.setCellDataToGrid();
        const sheet2 = new SpriteSheet(can2.canvas);
        sheet2.setCellDataToGrid();
        this.sheets.push(sheet1);
        this.sheets.push(sheet2);
        this.cellIndices[0] = 0;
        this.cellIndices[1] = 0;
    }
    // step the base animation forward one cell
    stepBaseAnimation(){
        let i_cell = this.cellIndices[0];
        i_cell += 1;
        i_cell = i_cell >= this.sheets[0].cell_count ? 0 : i_cell;
        this.cellIndices[0] = i_cell;
    }
};
//-------- ----------
// MAIN GAME MOD OBJECT TO EXPORT
//-------- ----------
const gameMod = {};
//-------- ----------
// Decimal
//-------- ----------
Decimal.set({ 
    precision: 40,
    maxE: 100,
    minE: -100
});
//-------- ----------
// GAME EVENTS
//-------- ----------
const GAME_EVENTS = new EventDispatcher();
// The mana_total_zero event will fire if a player has 0 mana and 0 mana per tick income
GAME_EVENTS.addEventListener('mana_total_zero', (evnt) => {
    console.log('Mana Total Zero Event! adding ' + constant.MANA_START + ' mana for ya.');
    evnt.game.mana = evnt.game.mana.add(constant.MANA_START);
});
// autosave delay event
GAME_EVENTS.addEventListener('autosave_delay', (evnt) => {
    evnt.game.autosave_ticks = 3;
    console.log('autosave delya set to: ' + evnt.game.autosave_ticks + ' ticks');
    
});
//-------- ----------
// SpriteLandSectonWorld Class ( for world state )
//-------- ----------
// draw a single texel for a single slot ( in world state )
const drawSectionSlotTexel = (ctx, slot, v2, rad_center, texelX, texelY) => {
    //!!! these should maybe be constants
    const radius_slot_delta = 70 / 8;
    const rad_delta = Math.PI / 180 * 15;
    // get block and image
    const block = slot.block;
    let img = constant.IMG.locked;
    if(!slot.locked){
        img = constant.IMG[block.type];
    }
    const rad_edge = rad_center - rad_delta;
    const rad_slot_start = rad_edge + Math.PI / 180 * ( 30 / 10 * slot.x );
    const rad_delta_texel = rad_delta * 2 / 10 / img.w;
    const rad_start = rad_slot_start + rad_delta_texel * texelX;
    const rad_end = rad_start + rad_delta_texel;
    const radius_slot_low = constant.LAND_RADIUS_TOCENTER - constant.LAND_RADIUS + radius_slot_delta * slot.y;
    const radius_texel_delta = radius_slot_delta / img.h;
    const radius_low = radius_slot_low + radius_texel_delta * texelY;
    const radius_high = radius_low + radius_texel_delta;
    // draw arcs
    ctx.beginPath();
    ctx.arc(v2.x, v2.y, radius_low, rad_start, rad_end  );
    ctx.arc(v2.x, v2.y, radius_high, rad_end, rad_start, true  );
    ctx.closePath();
    // get fill style, and fill
    const i_ci = texelY * img.w + texelX;
    ctx.fillStyle = img.palette[ img.color_indices[ i_ci ] ];
    ctx.fill();
};
// create a render sheet for the given section object
const createSectionRenderSheet = (section, drawSectionSlot) => {
    const can = canvasMod.create({
        size: 1024,
        state: {
            section: section
        },
        draw: (canObj, ctx, canvas, state) => {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            const section = state.section;
            const sprite = section.sprite_world;
            let i = 0;
            while(i < constant.SLOT_GRID_LEN){
                const bx = i % constant.SLOT_GRID_WIDTH;
                const by = Math.floor(i / constant.SLOT_GRID_WIDTH);
                const i_slot = by * constant.SLOT_GRID_WIDTH + bx;
                const slot = section.slots[i_slot];
                drawSectionSlot(ctx, section, slot)
                i += 1;
            }
        }
    });
    const sheet = new SpriteSheet(can.canvas);
    sheet.setCellDataToGrid( new Vector2(128, 128) );
    sheet.can = can;
    return sheet;
};
class SpriteLandSectionWorld extends Sprite {
    constructor (section) {
        super();
        this.section = section;
        this.type = 'SpriteLandSectonWorld';
        this.size.set(128, 128);
        this.sheets[0] = createSectionRenderSheet(this.section, this.drawSectionSlot);
        this.cellIndices[0] = 0;
    }
    // draw a section arc for a single slot object to be used in world state
    drawSectionSlot (ctx, section, slot) {
        const block = slot.block;
        let img = constant.IMG.locked;
        if(!slot.locked){
            img = constant.IMG[block.type];
        }
        const radian = Math.PI + Math.PI * 2 / constant.LAND_OBJECT_COUNT  * section.i;
        const radius_land = constant.LAND_RADIUS;
        // get a vector2 that is on the edge of the sun area
        const v1 = new Vector2(64 + Math.cos(radian) * radius_land, 64 + Math.sin(radian) * radius_land );
        // get a vector2 that is the center location
        const v2 = new Vector2(
            64 + Math.cos(radian) * constant.LAND_RADIUS_TOCENTER, 
            64 + Math.sin(radian) * constant.LAND_RADIUS_TOCENTER);
        let rad_center = Math.PI * 2 / constant.LAND_OBJECT_COUNT * section.i;
        // draw texels
        const len = img.w * img.h;
        let i_texel = 0;
        while(i_texel < len){
            const x = i_texel % img.w;
            const y = Math.floor(i_texel / img.w);
            drawSectionSlotTexel(ctx, slot, v2, rad_center, x, y);
            i_texel += 1;
        }
    }
    update(){
        canvasMod.update(this.sheets[0].can);
    }
};
//-------- ----------
// SpriteLandSectonLand Class ( for land state )
//-------- ----------
class SpriteLandSectionLand extends Sprite {
    constructor(section) {
        super();
        this.section = section;
        this.type = 'SpriteLandSectonLand';
        this.size.set(500, 280);
        this.sheets[0] = createSectionRenderSheet( this.section, this.drawSectionSlot );
        this.cellIndices[0] = 0;
    }
    // draw a single slot for the section object
    drawSectionSlot(ctx, section, slot){
        const block = slot.block;
        let img = constant.IMG.locked;
        if(!slot.locked){
            img = constant.IMG[block.type];
        }
        // draw texels
        const len = img.w * img.h;
        const block_width = 128 / 10;
        const block_height = 128 / 8;
        const texel_width = block_width / img.w;
        const texel_height = block_height / img.h;
        let i_texel = 0;
        while(i_texel < len){
            const texelX = i_texel % img.w;
            const texelY = Math.floor(i_texel / img.w);
            const i_ci = texelY * img.w + texelX;
            ctx.fillStyle = img.palette[ img.color_indices[ i_ci ] ];
            ctx.fillRect(
                slot.x * block_width + texel_width * texelX, 
                slot.y * block_height + texel_height * texelY, 
                texel_width, texel_height);
            i_texel += 1;
        }
    }
    update(){
        canvasMod.update(this.sheets[0].can);
    }
};
//-------- ----------
// BLOCK CLASS
//-------- ----------
class Block {
    constructor(opt) {
        opt = opt || {};
        this.type = opt.type || 'blank';
        this.mana_base = 0;
        this.mana_temp = 0;
        this.mana_value = null;
        this.upgradeCost = 0;
        this.setLevel(opt.level, this.type, 1);
    }
    // set the mana value object for this block
    setManaValue () {
        const mv_level = utils.addPows(10, this.level - 1);
        this.mana_value = {
           mv_level: new Decimal(mv_level),
           valueOf: function(){
               return this.mv_level;
            }
        };
    }
    // get the upgrade cost AT the given CURRENT block level
    getUpgradeCost (level_current, level_target) {
        level_target === undefined ? level_current + 1 : level_target;
        return new Decimal( utils.addPows(10, level_target - 1, level_current) );
        //return Decimal.pow(10, level_current === undefined ? this.level : level_current);
    }
    getMaxLevel (mana, level_current) {
        level_current = level_current === undefined ? this.level : level_current;
        let level_target = level_current;
        let mana_cost = 0;
        while(mana_cost <= mana){
            level_target += 1;
            mana_cost = this.getUpgradeCost(level_current, level_target).toNumber();
        }
        return level_target - 1;
    }
    // set mana stats without doing anything with level or type
    setManaStats (sunspot_multi = 1) {
        const TYPE_DEF = constant.BLOCKS[this.type];
        this.mana_base = TYPE_DEF.mana_base * sunspot_multi * this.level;
        this.mana_temp = Math.pow(TYPE_DEF.mana_temp * sunspot_multi, this.level);
    }
    // set the current level of the block, can also change type
    setLevel (level, type, sunspot_multi = 1 ) {
        this.level = level === undefined ? 1 : parseInt(level);
        this.type = type || this.type;
        this.setManaStats(sunspot_multi);
        this.mana_value = null;
        this.upgradeCost = this.getUpgradeCost(this.level, this.level + 1);
        this.setManaValue();
    }
    // copy some other block to this block
    copy (block) {
        this.setLevel(block.level, block.type, 1);
    }
    // clear a block to blank type
    clear () {
        this.setLevel(1, 'blank', 1);
    }
};
//-------- ----------
// SLOT CLASS
//-------- ----------
class Slot {
    constructor(opt) {
        opt = opt || {};
        this.i = opt.i === undefined ? 0 : opt.i;
        this.x = opt.x === undefined ? 0 : opt.x;
        this.y = opt.y === undefined ? 0 : opt.y;
        this.block = new Block({ type: 'blank'});
        this.locked = true;
    }
};
//-------- ----------
// Land Section
//-------- ----------
class LandSection {
    constructor(i, cx, cy, sectionData) {
        sectionData = sectionData || {};
        this.i = i;
        this.a = Math.PI * 2 * ( i / constant.LAND_OBJECT_COUNT);
        // use the vector2 class
        this.position = new Vector2();
        this.position.x = cx + Math.cos(this.a) * ( constant.SUNAREA_RADIUS + constant.LAND_RADIUS );
        this.position.y = cy + Math.sin(this.a) * ( constant.SUNAREA_RADIUS + constant.LAND_RADIUS );
        this.r = constant.LAND_RADIUS;
        this.slots = [];
        this.slot_unlock_count = 0;
        // counts_of_block_types/next_cost_of_somehting.
        this.bt_counts = {};  // counts for all block types for all slots 'blank, rock, ect'
        // temp
        this.d_alpha = 0;
        this.temp = 0;
        this.createSlotGrid();
        // starting unlock slots
        this.applySectionData(sectionData)
        // update the counts
        this.setBlockTypeCounts();
        // world state sprite object
        this.sprite_world = new SpriteLandSectionWorld(this);
        this.sprite_world.position.set(this.position.x, this.position.y);
        // land sprite sprite object
        this.sprite_land = new SpriteLandSectionLand(this);
        this.sprite_land.position.set(320, 240);
        // total mana value
        this.mana_total = new Decimal(0);
    }
    // apply section data
    applySectionData(sectionData){
        const unlock = sectionData.cols_unlock_slots;
        const blockdata = sectionData.cols_block_data || [];
        if(unlock){
            let x = 0;
            while(x < constant.SLOT_GRID_WIDTH){
                let y = constant.SLOT_GRID_HEIGHT - 1;
                let ct = unlock[x];
                let bd = [];
                if(blockdata[x]){
                    bd = blockdata[x].split(';');
                }
                while(ct > 0){
                    const slot = this.getSlot(x, y);
                    slot.locked = false;
                    const i_bd = unlock[x] - ct;
                    if( bd[ i_bd] ){
                        const str = bd[ i_bd];
                        const arr = str.split(',');
                        if(arr[0] === 'b'){
                            slot.block.clear();
                        }
                        if(arr[0] === 'r'){
                            slot.block.setLevel(arr[1], 'rock', 1);
                        }
                    }
                    y -= 1;
                    ct -= 1;
                }
                x += 1;
            }
        }
    }
    // get a section data object used for save states
    getSectionData(){
        const sectionData = {
            cols_unlock_slots: [],
            cols_block_data: []
        };
        let x = 0;
        while(x < constant.SLOT_GRID_WIDTH){
            let y = constant.SLOT_GRID_HEIGHT -  1;
            let unlock_ct = 0;
            let bd_str = '';
            while(y >= 0){
                const slot = this.getSlot(x, y);
                unlock_ct = slot.locked ? unlock_ct : unlock_ct + 1;
                if(!slot.locked){
                   if(slot.block.type === 'rock'){
                       bd_str += 'r,' + slot.block.level + ';'
                   }
                   if(slot.block.type === 'blank'){
                       bd_str += 'b,1;'
                   }
                }
                y -= 1;
            }
            sectionData.cols_block_data.push( bd_str );
            sectionData.cols_unlock_slots.push( unlock_ct );
            x += 1;
        }
        return sectionData;
    }
    // get a slot object by index or grid position
    getSlot(xi, y){
        let i = xi;
        if(y != undefined){
            i = this.getSlotIndex(xi, y);
        }
        return this.slots[i];
    }
    // get a slot index number if x and y are known
    getSlotIndex(x, y){
        return y * constant.SLOT_GRID_WIDTH + x;
    }
    // get a slot i, x, y object when just i is known
    getSlotXY (i) {
        return {
            i: i,
            x: i % constant.SLOT_GRID_WIDTH,
            y: Math.floor(i / constant.SLOT_GRID_WIDTH)
        }
    }
    // for each slot
    forEachSlot(func) {
        let i_slot = 0;
        const len = this.slots.length;
        while(i_slot < len){
            const slot = this.slots[i_slot];
            func.call(this, slot, i_slot, this);
            i_slot += 1;
        }
    }
    // set block type counts
    setBlockTypeCounts() {
        const bt_counts = this.bt_counts = Object.keys(constant.BLOCKS).reduce( (acc, typeKey) => {
            acc[typeKey] = 0;
            return acc;
        }, {});
        let slot_unlock_count = 0;
        this.forEachSlot( (slot) => {
            const ct = bt_counts[ slot.block.type ];
            bt_counts[ slot.block.type ] = ct === undefined ? 1 : ct + 1;
            slot_unlock_count += slot.locked ? 0 : 1;
        });
        this.slot_unlock_count = slot_unlock_count;
    }
    // create the Slot Grid
    createSlotGrid() {
        let i_slot = 0;
        this.slots = [];
        while(i_slot < constant.SLOT_GRID_LEN){
            const slot = new Slot( this.getSlotXY(i_slot) );
            this.slots.push(slot);
            i_slot += 1;
        }
    }
    // drop down blocks at a given slot
    dropDownBlocks(slot) {
        let y = slot.y;
        while(y >= 1){
            const slot_current = this.slots[ this.getSlotIndex( slot.x, y ) ];
            const slot_up = this.slots[ this.getSlotIndex( slot.x, y - 1 ) ];
            if(slot_up.block.type != 'blank'){
                slot_current.block.copy(slot_up.block);
                slot_up.block.clear();
            }
            y -= 1;
        }
    }
};
//-------- ----------
// Lands Class
//-------- ----------
class Lands {
    constructor(opt) {
        opt = opt || {};
        opt = Object.assign({}, { sectionData: [] }, opt);
        this.sections = [];
        this.bt_counts = {}; // block type grand total counts
        this.slot_unlock_cost = 0;
        this.slot_unlock_count = 0;
        this.slot_total = constant.SLOT_GRID_LEN * constant.LAND_OBJECT_COUNT;
        // total mana value
        this.mana_total = new Decimal(0);
        let i = 0;
        while(i < constant.LAND_OBJECT_COUNT){
            const sectionData = opt.sectionData[i] || {};
            const section = new LandSection(i, constant.SUN_CENTER.x, constant.SUN_CENTER.y, sectionData);
            this.sections.push(section);
            i += 1;
        }
        this.setBlockTypeCounts();
    }
    // call a function for each slot, of each land Section
    forEachSection (func) {
        let si = 0;
        const len = this.sections.length;
        while(si < len){
            const section = this.sections[si];
            func.call(this, section, si, this);
            si += 1;
        }
    }
    getSectionDataArray(){
        const array = [];
        this.forEachSection( (section) => {
           array.push(section.getSectionData());
        });
        return array;
    }
    // set grand total block type counts, slot unlock counts, and update slot unlock cost
    setBlockTypeCounts() {
        const bt_counts = this.bt_counts = Object.keys(constant.BLOCKS).reduce( (acc, typeKey) => {
            acc[typeKey] = 0;
            return acc;
        }, {});
        let slot_unlock_count = 0;
        this.forEachSection( (section) => {
            section.setBlockTypeCounts();
            Object.keys(constant.BLOCKS).forEach((typeKey)=>{
                bt_counts[typeKey] += section.bt_counts[typeKey];
            });
            slot_unlock_count += section.slot_unlock_count;
        });
        this.slot_unlock_count = slot_unlock_count;
        // update slot unlock cost
        const n = this.slot_unlock_count;
        const d = this.slot_total;
        this.slot_unlock_cost = Decimal.pow(10, 30 * ( n / d ) ).ceil().sub(1);
    }
};
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
            section.temp = Math.round( constant.TEMP_MAX * section.d_alpha );
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
            console.log('autosave ticks: ' + game.autosave_ticks);
            if(game.autosave_ticks === 0){
                console.log('saving the game.');
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
// create a new game state object
gameMod.create = (opt) => {
    opt = opt || {};
    opt = Object.assign({}, constant.DEFAULT_CREATE_OPTIONS, opt);
    const game = {
       platform: opt.platform || null,  // MUST GIVE A PLATFORM FOR gameMod.saveGame to work
       mana: new Decimal(opt.mana),
       mana_level: opt.mana_level,
       mana_cap: 0,      // set by calling getManaCap Helper
       mana_per_tick: new Decimal(0),
       sunspots: new Decimal(opt.sunspots),
       sunspots_delta: new Decimal(0),
       sunspots_delta_mana_level: new Decimal(0),
       sunspots_delta_world_value: new Decimal(0),
       sunspots_multi: 1,
       tick_frac: 0,
       tick: 0,           // game should update by a main tick count
       tick_last: 0,      // last tick can be subtracted from tick to get a tick delta
       last_update: opt.last_update || new Date(),
       autosave_ticks: 0 // 1 or more ticks is the number of ticks to the next game save
    };
    // figure sunspots_multi once here in create
    game.sunspot_multi = 1 + Math.log( 1 + game.sunspots.toNumber() ) / Math.log(10);
    // parse last_update if string
    if(typeof game.last_update === 'string'){
         game.last_update = new Date(game.last_update);
    }
    // create sun object
    game.sun = new Sun();
    game.sun.position.x = opt.x === undefined ? game.sun.center.x : opt.x;
    game.sun.position.y = opt.y === undefined ? game.sun.center.y : opt.y;
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
    const sun = game.sun;
    sun.position.copy(pos);
    const d = sun.position.distanceTo(sun.center);
    const md = constant.SUNAREA_RADIUS - sun.radius;
    if(d >= md){
       const a = sun.position.radianTo(sun.center);
       sun.position.x = sun.center.x + Math.cos(a) * md;
       sun.position.y = sun.center.y + Math.sin(a) * md;
    }
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
        manaCredit(game, block.mana_value.valueOf());
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
    save.mana_level = game.mana_level;
    save.sunspots = game.sunspots.toString();
    save.x = game.sun.position.x;
    save.y = game.sun.position.y;
    save.sectionData = game.lands.getSectionDataArray();
    save.last_update = game.last_update;
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
