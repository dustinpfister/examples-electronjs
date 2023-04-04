// game.js - r0 - for electionjs-example-mrsun
// create and update a game state object
(function(gameMod){
    //-------- ----------
    // CONST
    //-------- ----------
    const DEFAULT_CREATE_OPTIONS = {
        cx: 100, cy: 100, x:100, y: 100, mana: 1
    };
    const MAX_SUN_DIST = 150;
    const LAND_OBJECT_COUNT = 12;
    const BLOCK_GRID_WIDTH = 10;
    const BLOCK_GRID_HEIGHT = 8;
    const BLOCK_GRID_LEN = BLOCK_GRID_WIDTH * BLOCK_GRID_HEIGHT;
    //-------- ----------
    // HELPERS
    //-------- ----------
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
    const forEachLandBlock = (game, forEach) => {
        let i_land = 0;
        while(i_land < LAND_OBJECT_COUNT){
            const land = game.lands[i_land];
            let i_block = 0;
            while(i_block < BLOCK_GRID_LEN){
                const block = land.blocks[i_block];
                forEach(land, block, game);
                i_block += 1;
            }
            i_land += 1;
        };
    };
    //-------- ----------
    // PUBLIC API
    //-------- ----------
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
            r: 32
        };
        // land objects
        game.lands = [];
        let i = 0;
        const r = 40;
        while(i < LAND_OBJECT_COUNT){
           const a = Math.PI * 2 * ( i / LAND_OBJECT_COUNT);
           const land = {
               i: i,
               x: game.sun.cx + Math.cos(a) * ( MAX_SUN_DIST + r ),
               y: game.sun.cy + Math.sin(a) * ( MAX_SUN_DIST + r ),
               r: r,
               blocks: createBlockGrid()
           };
           game.lands.push(land);
           i += 1;
        }
        game.MAX_SUN_DIST = MAX_SUN_DIST;
        game.BLOCK_GRID_LEN = BLOCK_GRID_LEN;
        game.BLOCK_GRID_WIDTH = BLOCK_GRID_WIDTH;
        game.BLOCK_GRID_HEIGHT = BLOCK_GRID_HEIGHT;
        return game;
    };
    gameMod.updateByTickDelta = (game, tickDelta) => {
        game.tick_last = game.tick;
        game.tick_frac += tickDelta;
        game.tick = Math.floor(game.tick_frac);
        const tick_delta = game.tick - game.tick_last;
        if(tick_delta >= 1){
            console.log('tick_delta: ' + tick_delta);
            //game.mana_per_tick = getManaPerTick(game);
            //game.mana += game.mana_per_tick;
            game.mana_per_tick = 0;
            forEachLandBlock(game, (land, block) => {
                 game.mana_per_tick += block.mana_base;
            });
            game.mana += game.mana_per_tick;
        }
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
}(this['gameMod'] = {} ));