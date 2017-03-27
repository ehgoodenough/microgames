import * as Pixi from "pixi.js"
import Yaafloop from "yaafloop"
import Statgrab from "statgrab/do"
import FPSmeter from "fpsmeter"

var frame = document.getElementById("frame")

////////////////////////
// The Pixi Renderer //
//////////////////////

Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST
Pixi.renderer = Pixi.autoDetectRenderer(160, 160, {transparent: true})
Pixi.render = Pixi.renderer.render.bind(Pixi.renderer)

frame.appendChild(Pixi.renderer.view)

////////////////////
// The FPS Meter //
//////////////////

var isDevMode = window.location.search.includes("devmode")

var meter = isDevMode ? new FPSMeter(frame, {
    theme: "colorful", graph: true, heat: true,
    left: "auto", top: "10px", right: "10px",
    decimals: 0,
}) : null

/////////////////////
// The Game State //
///////////////////

import Game from "scripts/Game.js"
const game = new Game()

////////////////////
// The Game Loop //
//////////////////

var loop = new Yaafloop(function(delta) {
    game.update(delta)

    Pixi.render(game)

    if(!!meter) {
        meter.tick()
    }
})
