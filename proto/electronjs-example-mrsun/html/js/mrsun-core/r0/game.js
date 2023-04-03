// game.js - r0 - for electionjs-example-mrsun
// create and update a game state object
(function(gameMod){

    const DEFAULT_CREATE_OPTIONS = {
        cx: 100, cy: 100, x:100, y: 100
    };

    // create a new game state object
    gameMod.create = (opt) => {
        opt = opt || {};
        opt = Object.assign({}, DEFAULT_CREATE_OPTIONS, opt);
        const game = {};

        game.sun = {
            cx: opt.cx, cy: opt.cy,
            x: opt.x, y: opt.y
        };

        return game;
    };
}(this['gameMod'] = {} ));