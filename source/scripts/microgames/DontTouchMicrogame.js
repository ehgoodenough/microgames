import Pixi from "@ehgoodenough/pixi.js"
import Microgame from "scripts/microgames/Microgame.js"
import Frame from "scripts/Frame.js"

export default class DontTouchMicrogame extends Microgame {
    constructor() {
        super()
        
        this.addChild(new Art())
    }
    timeout() {
        this.state = "pass"
    }
}

class Art extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(Art.image))

        this.speed = 0.1
        
        this.interactive = true
        this.on("mousedown", (event) => {
            this.rotation = Math.PI / 12
            this.parent.timer.duration = 0
            this.state = "fail"
        })
    }
    update(delta) {
        this.position.x = Frame.width / 2
        this.position.y = Frame.height / 2
    }
    static get image() {
        return require("images/bananaman.png")
    }
}
