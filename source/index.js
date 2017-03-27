import Statgrab from "statgrab/do"
import Yaafloop from "yaafloop"

/////////////////////
// The Game State //
///////////////////

import Game from "scripts/Game.js"
const game = new Game()
document.getElementById("frame").appendChild(game.renderer.view)

////////////////////
// The Game Loop //
//////////////////

var loop = new Yaafloop(function(delta) {
    game.update(delta)
    game.render()
})
