import Pixi from "@ehgoodenough/pixi.js"
import Microgame from "scripts/microgames/Microgame.js"
import Frame from "scripts/Frame.js"

export default class DontTouchMicrogame extends Microgame {
    constructor(stage) {
        super()
        
        this.addChild(new Art(stage))
    }
    timeout() {
        this.state = "pass"
    }
}

var ARTS = [
    require("images/bananaman.png"),
    require("images/avacadoe.png"),
    require("images/pizzaladder.png"),
]

class Art extends Pixi.Sprite {
    constructor(stage = new Number()) {
        super(Pixi.Texture.fromImage(ARTS[stage % ARTS.length]))

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
}
