// game.js - for electionjs-example-mrsun
// create and update a game state object
(function(gameMod){
    //-------- ----------
    // Decimal
    //-------- ----------
    Decimal.set({ 
        precision: 40,
        maxE: 100,
        minE: -100
    });
    //-------- ----------
    // CONST
    //-------- ----------
    const constant = {};
    constant.DEFAULT_CREATE_OPTIONS = {
        cx: 100, cy: 100, x:100, y: 100, mana: '1', mana_level: 1
    };
    constant.SUN_RADIUS = 20;
    constant.LAND_RADIUS = 40;
    constant.SUNAREA_RADIUS = 150;
    constant.SUN_DMAX = constant.SUNAREA_RADIUS * 2 - constant.SUN_RADIUS * 2;
    constant.LAND_OBJECT_COUNT = 12;
    constant.BLOCK_MAX_LEVEL = 99;



    constant.MANA_MAX = new Decimal('1e100');
    constant.TEMP_MAX = 999;
    constant.MAX_BLOCK_POW = Math.log(10000000) / Math.log(2);


    constant.BLOCK_GRID_WIDTH = 10;
    constant.BLOCK_GRID_HEIGHT = 8;
    constant.BLOCK_GRID_LEN = constant.BLOCK_GRID_WIDTH * constant.BLOCK_GRID_HEIGHT;
    constant.BLOCK_LAND_MAX = Math.round(constant.BLOCK_GRID_LEN * 0.5);


    //-------- ----------
    // BLOCK TYPES
    //-------- ----------
    constant.BLOCKS = {};
    constant.BLOCKS.blank = {
        type: 'blank',
        mana_base: 0,
        mana_temp: 0
    };
    constant.BLOCKS.rock = {
        type: 'rock',
        mana_base: 1,
        mana_temp: 4
    };
    //-------- ----------
    // BLOCK CLASS
    //-------- ----------
    class Block {
        constructor(opt) {
            opt || opt || {};
            this.type = opt.type || 'blank';
            this.level = 1;
            this.mana_temp = 0;
            this.mana_base = 0;
            this.mana_value = null;
            this.setManaValue(0);
        }
        // set the mana value object for this block
        setManaValue (block_cost) {
            this.mana_value = {
               mana_block_cost: new Decimal(block_cost),
               valueOf: function(){
                   return this.mana_block_cost;
                }
            };
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
            this.block = new Block('blank')
        }
    };
    //-------- ----------
    // Land Section
    //-------- ----------
    class LandSection {
        constructor(i, cx, cy) {
            this.i = i;
            this.a = Math.PI * 2 * ( i / constant.LAND_OBJECT_COUNT);
            this.x = cx + Math.cos(this.a) * ( constant.SUNAREA_RADIUS + constant.LAND_RADIUS ),
            this.y = cy + Math.sin(this.a) * ( constant.SUNAREA_RADIUS + constant.LAND_RADIUS ),
            this.r = constant.LAND_RADIUS;
                    //blocks: createBlockGrid(),
            this.slots = [];
            this.d_alpha = 0;
            this.temp = 0;
            this.rock_count = 0;
            this.rock_cost = 0;
            //this.setNextBlockCost(0)
            this.createSlotGrid();
        }
        // get a slot i, x, y object when just i is known
        getSlotXY (i) {
            return {
                i: i,
                x: i % constant.BLOCK_GRID_WIDTH,
                y: Math.floor(i / constant.BLOCK_GRID_WIDTH)
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
        // create the Slot Grid
        createSlotGrid() {
            let i_slot = 0;
            this.slots = [];
            while(i_slot < constant.BLOCK_GRID_LEN){
                //const block = new Block({ i: i, type: 'blank' });
                //blocks.push( block );
                const slot = new Slot( this.getSlotXY(i_slot) );
                this.slots.push(slot);
                i_slot += 1;
            }
        }
    };
    //-------- ----------
    // Lands Class
    //-------- ----------
    class Lands {
        constructor(game) {
            this.sections = [];
            let i = 0;
            while(i < constant.LAND_OBJECT_COUNT){
                const section = new LandSection(i, game.sun.cx, game.sun.cy);
                this.sections.push(section);
                i += 1;
            }
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
    // create a new block grid object
    const createBlockGrid = () => {
        let i = 0;
        const blocks = [];
        while(i < constant.BLOCK_GRID_LEN){
            const block = new Block({ i: i, type: 'blank' });
            blocks.push( block );
            i += 1;
        }
        return blocks;
    };
    // get block upgrade cost
    const getBlockUpgradeCost = (block) => {
        return Decimal.pow(10, block.level);
    };
    // get a cost of the next block
    const getNextBlockCost = (i) => {
        let n = Math.pow(2, constant.MAX_BLOCK_POW * (i / constant.BLOCK_LAND_MAX));
        n = Math.ceil(n);
        n = n > constant.MANA_MAX ? constant.MANA_MAX : n;
        return n;
    };
    // get the x and y pos if the index is known
    const getBlockXY = (blockIndex) => {
        return {
            x: blockIndex % constant.BLOCK_GRID_WIDTH,
            y: Math.floor(blockIndex / constant.BLOCK_GRID_WIDTH)
        };
    };
    // get the block index of the x and y pos is known
    const getBlockIndex = (x, y) => {
        return y * constant.BLOCK_GRID_WIDTH + x;
    };
    // get the next blank block in a col
    const getNextBlankBlock = (game, i_land, i_block) => {
        const land = game.lands[i_land];
        const pos_block = getBlockXY(i_block);
        let y = constant.BLOCK_GRID_HEIGHT;
        while(y--){
            const i_colblock = getBlockIndex(pos_block.x, y);
            const block = land.blocks[i_colblock];
            if(block.type === 'blank'){
                return block;
            }
        }
        return false;
    };
    // drop down blocks after an absorb event
    const dropDownBlocks = (game, i_land, i_block) => {
        const land = game.lands[i_land];
        const pos_block = getBlockXY(i_block);
        // get non blank blocks
        let y = pos_block.y;
        while(y >= 1){
            const block_current = land.blocks[ getBlockIndex(pos_block.x, y) ];
            const block_up = land.blocks[ getBlockIndex(pos_block.x, y - 1) ];
            if(block_up.type != 'blank'){
                console.log(block_up);
                block_current.type = block_up.type;
                block_current.level = block_up.level;
                block_current.mana_base = block_up.mana_base;
                block_current.mana_temp = block_up.mana_temp;
                block_current.mana_value = block_up.mana_value;
                block_up.type = 'blank';
                block_up.mana_base = 0;
                block_up.mana_temp = 0;
            }
            y -= 1;
        }
    };
    // for each land block helper
    const forEachLandBlock = (game, forEachLand, forEachBlock) => {
        let i_land = 0;
        while(i_land < constant.LAND_OBJECT_COUNT){
            const land = game.lands[i_land];
            let i_block = 0;
            forEachLand(land, game);
            while(i_block < constant.BLOCK_GRID_LEN){
                const block = land.blocks[i_block];
                forEachBlock(land, block, game);
                i_block += 1;
            }
            i_land += 1;
        };
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
    //-------- ----------
    // PUBLIC API
    //-------- ----------
    gameMod.updateByTickDelta = (game, tickDelta, force) => {
        game.tick_last = game.tick;
        game.tick_frac += tickDelta;
        game.tick = Math.floor(game.tick_frac);
        const tick_delta = game.tick - game.tick_last;
        if(tick_delta >= 1 || force){
            game.mana_per_tick = new Decimal(0);
/*
            forEachLandBlock(game,
                (land, game) => {
                     const d_sun = utils.distance(land.x, land.y, game.sun.x, game.sun.y);
                     const d_adjusted = d_sun - land.r - game.sun.r;
                     land.d_alpha = 1 - d_adjusted / constant.SUN_DMAX;
                     land.temp = Math.round( constant.TEMP_MAX * land.d_alpha );
                     land.rock_count = 0;
                },
                (land, block, game) => {
                     const a_temp = land.temp / constant.TEMP_MAX;
                     game.mana_per_tick = game.mana_per_tick.add(Math.round(block.mana_base + block.mana_temp * a_temp));
                     land.rock_count += block.type === 'rock' ? 1 : 0;
                     land.rock_cost = getNextBlockCost(land.rock_count);
                }
            );
*/
            const mana_delta = Decimal.mul(game.mana_per_tick, tick_delta);
            manaCredit(game, mana_delta);
        }
    };
    // create a new game state object
    gameMod.create = (opt) => {
        opt = opt || {};
        opt = Object.assign({}, constant.DEFAULT_CREATE_OPTIONS, opt);
        const game = {
           mana: new Decimal(opt.mana),
           mana_level: opt.mana_level,
           mana_cap: 0,      // set by calling getManaCap Helper
           mana_per_tick: new Decimal(0),
           tick_frac: 0,
           tick: 0,          // game should update by a main tick count
           tick_last: 0      // last tick can be subtracted from tick to get a tick delta
        };
        // create sun object
        game.sun = {
            cx: opt.cx, cy: opt.cy,
            x: opt.x, y: opt.y,
            r: constant.SUN_RADIUS
        };
        // land objects

        game.lands = new Lands(game);
        console.log(game.lands)

        game.lands.forEachSection( (section) => {

console.log(section)

        });

        Object.assign(game, constant);
        game.mana_cap = getManaCap(game);
        gameMod.updateByTickDelta(game, 0, true);
        return game;
    };
    // set the sun position
    gameMod.setSunPos = (game, x, y) => {
        const sun = game.sun;
        sun.x = x;
        sun.y = y;
        const d = utils.distance(x, y, sun.cx, sun.cy);
        const md = constant.SUNAREA_RADIUS - sun.r;
        if(d >= md){
            const a = Math.atan2(sun.y - sun.cy, sun.x - sun.cx);
            sun.x = sun.cx + Math.cos(a) * md;
            sun.y = sun.cy + Math.sin(a) * md;
        }
    };
    // get land object by x, y pos or false if nothing there
    gameMod.getSectionByPos = (game, x, y) => {
        let i = 0;
        while(i < constant.LAND_OBJECT_COUNT){
           const section = game.lands.sections[i];
           const d = utils.distance(x, y, section.x, section.y);
           if(d < section.r){
              return section;
           }
           i += 1;
        }
        return false;
    };
    // buy a block for the given land and block index
    gameMod.buyBlock = (game, i_land, i_block) => {
        
    };
    // set the given land and block index back to blank, and absorb the mana value to game.mana
    gameMod.absorbBlock = (game, i_land, i_block) => {
        
    };
    // upgrade block
    gameMod.upgradeBlock = (game, i_land, i_block) => {
        
    };


/*
    gameMod.updateByTickDelta = (game, tickDelta, force) => {
        game.tick_last = game.tick;
        game.tick_frac += tickDelta;
        game.tick = Math.floor(game.tick_frac);
        const tick_delta = game.tick - game.tick_last;
        if(tick_delta >= 1 || force){
            game.mana_per_tick = new Decimal(0);
            forEachLandBlock(game,
                (land, game) => {
                     const d_sun = utils.distance(land.x, land.y, game.sun.x, game.sun.y);
                     const d_adjusted = d_sun - land.r - game.sun.r;
                     land.d_alpha = 1 - d_adjusted / constant.SUN_DMAX;
                     land.temp = Math.round( constant.TEMP_MAX * land.d_alpha );
                     land.rock_count = 0;
                },
                (land, block, game) => {
                     const a_temp = land.temp / constant.TEMP_MAX;
                     game.mana_per_tick = game.mana_per_tick.add(Math.round(block.mana_base + block.mana_temp * a_temp));
                     land.rock_count += block.type === 'rock' ? 1 : 0;
                     land.rock_cost = getNextBlockCost(land.rock_count);
                }
            );
            const mana_delta = Decimal.mul(game.mana_per_tick, tick_delta);
            manaCredit(game, mana_delta);
        }
    };
    // create a new game state object
    gameMod.create = (opt) => {
        opt = opt || {};
        opt = Object.assign({}, constant.DEFAULT_CREATE_OPTIONS, opt);
        const game = {
           mana: new Decimal(opt.mana),
           mana_level: opt.mana_level,
           mana_cap: 0,      // set by calling getManaCap Helper
           mana_per_tick: new Decimal(0),
           tick_frac: 0,
           tick: 0,          // game should update by a main tick count
           tick_last: 0      // last tick can be subtracted from tick to get a tick delta
        };
        // create sun object
        game.sun = {
            cx: opt.cx, cy: opt.cy,
            x: opt.x, y: opt.y,
            r: constant.SUN_RADIUS
        };
        // land objects
        game.lands = [];
        let i = 0;
        while(i < constant.LAND_OBJECT_COUNT){
           const a = Math.PI * 2 * ( i / constant.LAND_OBJECT_COUNT);
           const land = {
               i: i,
               x: game.sun.cx + Math.cos(a) * ( constant.SUNAREA_RADIUS + constant.LAND_RADIUS ),
               y: game.sun.cy + Math.sin(a) * ( constant.SUNAREA_RADIUS + constant.LAND_RADIUS ),
               r: constant.LAND_RADIUS,
               blocks: createBlockGrid(),
               d_alpha: 0,
               temp: 0,
               rock_count: 0,
               rock_cost: getNextBlockCost(0)
           };
           game.lands.push(land);
           i += 1;
        }
        Object.assign(game, constant);
        game.mana_cap = getManaCap(game);
        gameMod.updateByTickDelta(game, 0, true);
        return game;
    };
    // set the sun position
    gameMod.setSunPos = (game, x, y) => {
        const sun = game.sun;
        sun.x = x;
        sun.y = y;
        const d = utils.distance(x, y, sun.cx, sun.cy);
        const md = constant.SUNAREA_RADIUS - sun.r;
        if(d >= md){
            const a = Math.atan2(sun.y - sun.cy, sun.x - sun.cx);
            sun.x = sun.cx + Math.cos(a) * md;
            sun.y = sun.cy + Math.sin(a) * md;
        }
    };
    // get land object by x, y pos or false if nothing there
    gameMod.getLandByPos = (game, x, y) => {
        let i = 0;
        while(i < constant.LAND_OBJECT_COUNT){
           const land = game.lands[i];
           const d = utils.distance(x, y, land.x, land.y);
           if(d < land.r){
              return land;
           }
           i += 1;
        }
        return false;
    };
    // buy a block for the given land and block index
    gameMod.buyBlock = (game, i_land, i_block) => {
        const land = game.lands[i_land];
        const block = getNextBlankBlock(game, i_land, i_block);
        if(block){
            gameMod.updateByTickDelta(game, 0, true);
            if(block.type === 'blank' && land.rock_count < constant.BLOCK_LAND_MAX){
                if(game.mana >= land.rock_cost){
                    game.mana = game.mana.sub(land.rock_cost);
                    Object.assign(block, constant.BLOCKS.rock);
                    block.setManaValue(land.rock_cost);
                    block.level = 1;
                    block.upgradeCost = getBlockUpgradeCost(block);
                    land.rock_cost = getNextBlockCost(land.rock_count + 1);
                }
            }
        }
    };
    // set the given land and block index back to blank, and absorb the mana value to game.mana
    gameMod.absorbBlock = (game, i_land, i_block) => {
        const land = game.lands[i_land];
        const block = land.blocks[i_block];
        if(block.type != 'blank'){
            manaCredit(game, block.mana_value.valueOf());
            Object.assign(block, constant.BLOCKS.blank);
            block.setManaValue(0);
            block.level = 1;
            block.upgradeCost = getBlockUpgradeCost(block);
            dropDownBlocks(game, i_land, i_block);
        }
    };
    // upgrade block
    gameMod.upgradeBlock = (game, i_land, i_block) => {
        const land = game.lands[i_land];
        const block = land.blocks[i_block];
        if(block.type === 'rock' && block.level < constant.BLOCK_MAX_LEVEL && game.mana.gte(block.upgradeCost) ){
            game.mana = game.mana.sub(block.upgradeCost);
            block.level += 1;
            const rData = constant.BLOCKS.rock;
            block.mana_base = rData.mana_base * block.level;
            block.mana_temp = Math.pow(rData.mana_temp, block.level);
            block.upgradeCost = getBlockUpgradeCost(block);
        }
    };
*/
}( this['gameMod'] = {} ));
