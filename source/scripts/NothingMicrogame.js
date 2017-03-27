import * as Pixi from "pixi.js"
import Microgame from "scripts/Microgame.js"

export default class NothingMicrogame extends Microgame {
    constructor() {
        super()

        this.frog = new Frog()
        this.addChild(this.frog)
    }
    update(delta) {
        this.frog.update(delta)
    }
}

class Frog extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(Frog.image))

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.position.x = 160 / 2
        this.position.y = 160 / 2

        this.speed = 0.1
    }
    update(delta) {
        this.rotation += (Math.random() * this.speed) - (this.speed / 2)
    }
    static get image() {
        return require("images/frog.big.png")
    }
}
