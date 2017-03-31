import Pixi from "@ehgoodenough/pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

import RunMicrogame from "scripts/microgames/RunMicrogame.js"
import ShootMicrogame from "scripts/microgames/ShootMicrogame.js"
import DontTouchMicrogame from "scripts/microgames/DontTouchMicrogame.js"
import PopMicrogame from "scripts/microgames/PopMicrogame.js"

import Frame from "scripts/Frame.js"

const WAIT = 500
var MICROGAMES = [
    // DontTouchMicrogame,
    // RunMicrogame,
    ShootMicrogame,
    // PopMicrogame
]

export default class Game extends Pixi.Container {
    constructor() {
        super()

        this.renderer = Pixi.autoDetectRenderer(Frame.width, Frame.height, {
            transparent: true
        })

        this.startMicrogame()
    }
    update(delta) {
        if(this.microgame != undefined) {

            if(this.microgame.hasEnded) {
                if(this.microgame.timer.duration <= -1 * (this.microgame.wait || WAIT)) {
                    this.startMicrogame()
                }
            }

            this.microgame.update(delta)
        }
    }
    render() {
        this.renderer.render(this)
    }
    startMicrogame() {
        if(this.microgame != undefined) {
            this.removeChild(this.microgame)
        }

        if(this.microgames == null
        || this.microgames.length == 0) {
            this.microgames = MICROGAMES.slice()
            // TODO: filter unplayable
            // TODO: randomly shuffle

            this.stage = isNaN(this.stage) ? 0 : this.stage + 1
        }

        var Microgame = this.microgames.shift()

        this.microgame = new Microgame(this.stage)
        this.addChild(this.microgame)
    }
}
