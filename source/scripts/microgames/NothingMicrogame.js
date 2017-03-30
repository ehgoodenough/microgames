import Pixi from "@ehgoodenough/pixi.js"
import Microgame from "scripts/microgames/Microgame.js"

export default class NothingMicrogame extends Microgame {
    constructor() {
        super()

        this.frog = new Frog()
        this.addChild(this.frog)
    }
    end() {
        this.state = "pass"
    }
}

class Frog extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(Frog.image))

        this.scale.x = 5
        this.scale.y = 5

        this.speed = 0.1
    }
    update(delta) {
        this.position.x = this.origin.renderer.width / 2
        this.position.y = this.origin.renderer.height / 2

        if(this.parent.timer > 0) {
            this.rotation += (Math.random() * this.speed) - (this.speed / 2)
        }
    }
    static get image() {
        return require("images/frog.png")
    }
}
