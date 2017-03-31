import Pixi from "@ehgoodenough/pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

import RunMicrogame from "scripts/microgames/RunMicrogame.js"
import CatchMicrogame from "scripts/microgames/CatchMicrogame.js"
import DontTouchMicrogame from "scripts/microgames/DontTouchMicrogame.js"

import Frame from "scripts/Frame.js"

var MICROGAMES = [RunMicrogame]
// MICROGAMES = Lodash.shuffle(MICROGAMES)
// MICROGAMES = MICROGAMES.filter((microgame) => {
//     return microgame.isPlayable
// })

const WAIT = 500

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
                if(this.microgame.timer.duration <= -1 * WAIT) {
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

        this.microgame = new MICROGAMES[0]()
        MICROGAMES.push(MICROGAMES.shift())
        this.addChild(this.microgame)
    }
}
