import Pixi from "@ehgoodenough/pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

import NothingMicrogame from "scripts/NothingMicrogame.js"

var MICROGAMES = [
    NothingMicrogame
]

export default class Game extends Pixi.Container {
    constructor() {
        super()

        this.renderer = Pixi.autoDetectRenderer(160, 160, {transparent: true})

        // this.microgames = Lodash.shuffle(this.microgames)
        // this.microgames = this.microgames.filter((microgame) => {
        //     return microgame.isPlayable
        // })

        this.microgame = MICROGAMES[0].instantiate()
        this.addChild(this.microgame)
    }
    update(delta) {
        if(this.microgame != undefined) {
            this.microgame.update(delta)
        }
    }
    render() {
        this.renderer.render(this)
    }
}
