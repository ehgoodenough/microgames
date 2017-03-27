import Pixi from "@ehgoodenough/pixi.js"
import Microgame from "scripts/Microgame.js"

export default class NothingMicrogame extends Microgame {
    constructor() {
        super()

        this.frog = new Frog()
        this.addChild(this.frog)
    }
}

class Frog extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(Frog.image))

        this.anchor.x = 0.5
        this.anchor.y = 0.5

        this.speed = 0.1
    }
    update(delta) {
        this.position.x = this.parent.parent.renderer.width / 2
        this.position.y = this.parent.parent.renderer.height / 2

        this.rotation += (Math.random() * this.speed) - (this.speed / 2)
    }
    static get image() {
        return require("images/frog.big.png")
    }
}
