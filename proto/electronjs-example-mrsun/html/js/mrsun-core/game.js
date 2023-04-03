// game.js - r0 - for electionjs-example-mrsun
// create and update a game state object
(function(gameMod){
    const DEFAULT_CREATE_OPTIONS = {
        cx: 100, cy: 100, x:100, y: 100
    };
    const MAX_SUN_DIST = 150;
    const LAND_OBJECT_COUNT = 12;
    // create a new game state object
    gameMod.create = (opt) => {
        opt = opt || {};
        opt = Object.assign({}, DEFAULT_CREATE_OPTIONS, opt);
        const game = {};
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
               r: r
           };
           game.lands.push(land);
           i += 1;
        }
        game.MAX_SUN_DIST = MAX_SUN_DIST;
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
}(this['gameMod'] = {} ));