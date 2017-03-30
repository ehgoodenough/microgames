import Pixi from "@ehgoodenough/pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

import NothingMicrogame from "scripts/microgames/NothingMicrogame.js"

var MICROGAMES = [
    NothingMicrogame
]

// this.microgames = Lodash.shuffle(this.microgames)
// this.microgames = this.microgames.filter((microgame) => {
//     return microgame.isPlayable
// })

export default class Game extends Pixi.Container {
    constructor() {
        super()

        this.renderer = Pixi.autoDetectRenderer(160, 160, {transparent: true})

        this.startMicrogame()
    }
    update(delta) {
        if(this.microgame != undefined) {
            this.microgame.update(delta)

            if(this.microgame.hasEnded) {
                if(this.microgame.timer <= -1000) {
                    this.startMicrogame()
                }
            }
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
