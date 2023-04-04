// game.js - r0 - for electionjs-example-mrsun
// create and update a game state object
(function(gameMod){
    //-------- ----------
    // CONST
    //-------- ----------
    const DEFAULT_CREATE_OPTIONS = {
        cx: 100, cy: 100, x:100, y: 100, mana: 1
    };
    const SUN_RADIUS = 20;
    const LAND_RADIUS = 40;
    const MAX_SUN_DIST = 150;
    const SUN_DMAX = MAX_SUN_DIST * 2 - SUN_RADIUS * 2;
    const LAND_OBJECT_COUNT = 12;
    const BLOCK_GRID_WIDTH = 10;
    const BLOCK_GRID_HEIGHT = 8;
    const BLOCK_GRID_LEN = BLOCK_GRID_WIDTH * BLOCK_GRID_HEIGHT;
    const BLOCK_LAND_MAX = Math.round(BLOCK_GRID_LEN * 0.5);
    const MANA_MAX = 10000000;
    const TEMP_MAX = 999;
    const MAX_BLOCK_POW = Math.log(MANA_MAX) / Math.log(2);
    //-------- ----------
    // HELPERS
    //-------- ----------
    const getNextBlockCost = (i) => {
        let n = Math.pow(2, MAX_BLOCK_POW * (i / BLOCK_LAND_MAX));
        n = Math.ceil(n);
        n = n > MANA_MAX ? MANA_MAX : n;
        return n;
    };
    // create a new block grid object
    const createBlockGrid = () => {
        let i = 0;
        const blocks = [];
        while(i < BLOCK_GRID_LEN){
            blocks.push({
                type: 'blank',
                mana_base: 0,
                mana_temp: 0,
                mana_delta: 0
            });
            i += 1;
        }
        return blocks;
    };
    // for each land block helper
    const forEachLandBlock = (game, forEachLand, forEachBlock) => {
        let i_land = 0;
        while(i_land < LAND_OBJECT_COUNT){
            const land = game.lands[i_land];
            let i_block = 0;
            forEachLand(land, game);
            while(i_block < BLOCK_GRID_LEN){
                const block = land.blocks[i_block];
                forEachBlock(land, block, game);
                i_block += 1;
            }
            i_land += 1;
        };
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
            game.mana_per_tick = 0;
            forEachLandBlock(game,
                (land, game) => {
                     const d_sun = utils.distance(land.x, land.y, game.sun.x, game.sun.y);
                     const d_adjusted = d_sun - land.r - game.sun.r;
                     land.d_alpha = 1 - d_adjusted / SUN_DMAX;
                     land.temp = Math.round( TEMP_MAX * land.d_alpha );
                     land.rock_count = 0;
                },
                (land, block, game) => {
                     const a_temp = land.temp / TEMP_MAX;
                     game.mana_per_tick += Math.round(block.mana_base + block.mana_temp * a_temp);
                     land.rock_count += block.type === 'rock' ? 1 : 0;
                     land.rock_cost = getNextBlockCost(land.rock_count);
                }
            );
            game.mana += game.mana_per_tick;
            game.mana = game.mana > MANA_MAX ? MANA_MAX : game.mana;
        }
    };
    // create a new game state object
    gameMod.create = (opt) => {
        opt = opt || {};
        opt = Object.assign({}, DEFAULT_CREATE_OPTIONS, opt);
        const game = {
           mana: opt.mana,
           mana_per_tick: 0,
           tick_frac: 0,
           tick: 0,          // game should update by a main tick count
           tick_last: 0      // last tick can be subtracted from tick to get a tick delta
        };
        // create sun object
        game.sun = {
            cx: opt.cx, cy: opt.cy,
            x: opt.x, y: opt.y,
            r: SUN_RADIUS
        };
        // land objects
        game.lands = [];
        let i = 0;
        while(i < LAND_OBJECT_COUNT){
           const a = Math.PI * 2 * ( i / LAND_OBJECT_COUNT);
           const land = {
               i: i,
               x: game.sun.cx + Math.cos(a) * ( MAX_SUN_DIST + LAND_RADIUS ),
               y: game.sun.cy + Math.sin(a) * ( MAX_SUN_DIST + LAND_RADIUS ),
               r: LAND_RADIUS,
               blocks: createBlockGrid(),
               d_alpha: 0,
               temp: 0,
               rock_count: 0,
               rock_cost: getNextBlockCost(0)
           };
           game.lands.push(land);
           i += 1;
        }
        game.MAX_SUN_DIST = MAX_SUN_DIST;
        game.BLOCK_GRID_LEN = BLOCK_GRID_LEN;
        game.BLOCK_GRID_WIDTH = BLOCK_GRID_WIDTH;
        game.BLOCK_GRID_HEIGHT = BLOCK_GRID_HEIGHT;
        gameMod.updateByTickDelta(game, 1);
        return game;
    };
    // set the sun position
    gameMod.setSunPos = (game, x, y) => {
        const sun = game.sun;
        sun.x = x;
        sun.y = y;
        const d = utils.distance(x, y, sun.cx, sun.cy);
        const md = MAX_SUN_DIST - sun.r;
        if(d >= md){
            const a = Math.atan2(sun.y - sun.cy, sun.x - sun.cx);
            sun.x = sun.cx + Math.cos(a) * md;
            sun.y = sun.cy + Math.sin(a) * md;
        }
    };
    // get land object by x, y pos or false if nothing there
    gameMod.getLandByPos = (game, x, y) => {
        let i = 0;
        while(i < LAND_OBJECT_COUNT){
           const land = game.lands[i];
           const d = utils.distance(x, y, land.x, land.y);
           if(d < land.r){
              return land;
           }
           i += 1;
        }
        return false;
    };
    gameMod.buyBlock = (game, i_land, i_block) => {
        const land = game.lands[i_land];
        const block = land.blocks[i_block];
        if(block.type === 'blank'){
           if(game.mana >= land.rock_cost){
               game.mana -= land.rock_cost;
               block.type = 'rock';
               block.mana_base = 1;
               block.mana_temp = 4;
               block.mana_delta = 1;
           }
           land.rock_cost = getNextBlockCost(land.rock_count + 1);
        }
    };
}(this['gameMod'] = {} ));