import Pixi from "@ehgoodenough/pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

import NothingMicrogame from "scripts/NothingMicrogame.js"

export default class Game extends Pixi.Container {
    constructor() {
        super()

        this.renderer = Pixi.autoDetectRenderer(160, 160, {transparent: true})

        this.microgames = [
            NothingMicrogame
        ]

        this.microgames = this.microgames.filter((microgame) => {
            return microgame.isPlayable
        })

        // this.microgames = Lodash.shuffle(this.microgames)

        this.microgame = this.microgames[0].create()
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
