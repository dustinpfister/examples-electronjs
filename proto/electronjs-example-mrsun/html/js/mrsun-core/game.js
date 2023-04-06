// game.js - for electionjs-example-mrsun
// create and update a game state object
(function(gameMod){
    //-------- ----------
    // Decimal
    //-------- ----------
    Decimal.set({ 
        precision: 40,
        maxE: 30,
        minE: -30
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
    constant.BLOCK_GRID_WIDTH = 10;
    constant.BLOCK_GRID_HEIGHT = 8;
    constant.BLOCK_GRID_LEN = constant.BLOCK_GRID_WIDTH * constant.BLOCK_GRID_HEIGHT;
    constant.BLOCK_LAND_MAX = Math.round(constant.BLOCK_GRID_LEN * 0.5);
    constant.MANA_MAX = new Decimal('1e100');
    constant.TEMP_MAX = 999;
    constant.MAX_BLOCK_POW = Math.log(10000000) / Math.log(2);
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
    // get a cost of the next block
    const getNextBlockCost = (i) => {
        let n = Math.pow(2, constant.MAX_BLOCK_POW * (i / constant.BLOCK_LAND_MAX));
        n = Math.ceil(n);
        n = n > constant.MANA_MAX ? constant.MANA_MAX : n;
        return n;
    };
    // create a mana value object
    const createManaValue = (block_cost) => {
        block_cost = block_cost || 0;
        const mana_value = {
            mana_block_cost: new Decimal(block_cost),
            valueOf: function(){
                return this.mana_block_cost;
            }
        };
        return mana_value;
    };
    // create a new block grid object
    const createBlockGrid = () => {
        let i = 0;
        const blocks = [];
        while(i < constant.BLOCK_GRID_LEN){
            const block = Object.assign({}, constant.BLOCKS.blank);
            block.level = 1;
            block.mana_value = createManaValue(0);
            blocks.push( block );
            i += 1;
        }
        return blocks;
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
    gameMod.updateByTickDelta = (game, tickDelta) => {
        game.tick_last = game.tick;
        game.tick_frac += tickDelta;
        game.tick = Math.floor(game.tick_frac);
        const tick_delta = game.tick - game.tick_last;
        if(tick_delta >= 1){
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
        const block = land.blocks[i_block];
        if(block.type === 'blank' && land.rock_count < constant.BLOCK_LAND_MAX){
           if(game.mana >= land.rock_cost){
               game.mana = game.mana.sub(land.rock_cost);
               Object.assign(block, constant.BLOCKS.rock);
               block.mana_value = createManaValue(land.rock_cost);
           }
           land.rock_cost = getNextBlockCost(land.rock_count + 1);
        }
    };
    // set the given land and block index back to blank, and absorb the mana value to game.mana
    gameMod.absorbBlock = (game, i_land, i_block) => {
        const land = game.lands[i_land];
        const block = land.blocks[i_block];
        if(block.type != 'blank'){
            manaCredit(game, block.mana_value.valueOf());
        }
        Object.assign(block, constant.BLOCKS.blank);
        block.mana_value = createManaValue(0);
    };
    // upgrade block
    gameMod.upgradeBlock = (game, i_land, i_block) => {
        const land = game.lands[i_land];
        const block = land.blocks[i_block];
        console.log('upgrade block at: ' + i_land + ', ' + i_block);
        if(block.type = 'rock'){
            block.level += 1;
            const rData = constant.BLOCKS.rock;
            block.mana_base = rData.mana_base * block.level;
            block.mana_temp = Math.pow(rData.mana_temp, block.level);

        }
        console.log('block level: ' + block.level);
        console.log('mana_base: ' + block.mana_base);
        console.log('mana_temp: ' + block.mana_temp);
    };
}(this['gameMod'] = {} ));