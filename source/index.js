var Pixi = require("pixi.js")
var Afloop = require("afloop")

var microgame = require("games/dodgeball.js")

var loop = new Afloop(function(delta) {
    microgame.onUpdate(delta)
})
