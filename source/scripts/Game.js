import Pixi from "@ehgoodenough/pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

import DontTouchMicrogame from "scripts/microgames/DontTouchMicrogame.js"

var MICROGAMES = [
    DontTouchMicrogame
]

// MICROGAMES = Lodash.shuffle(MICROGAMES)
// MICROGAMES = MICROGAMES.filter((microgame) => {
//     return microgame.isPlayable
// })

const WIDTH = 90
const HEIGHT = 160
const WAIT = 500

export default class Game extends Pixi.Container {
    constructor() {
        super()

        this.renderer = Pixi.autoDetectRenderer(WIDTH, HEIGHT, {
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
