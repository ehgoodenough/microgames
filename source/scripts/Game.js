import Pixi from "@ehgoodenough/pixi.js"

import NothingMicrogame from "scripts/NothingMicrogame.js"

export default class Game extends Pixi.Container {
    constructor() {
        super()

        this.microgame = new NothingMicrogame()
        this.addChild(this.microgame)
    }
    update(delta) {
        if(this.microgame != undefined) {
            this.microgame.update(delta)
        }
    }
}
