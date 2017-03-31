import Pixi from "@ehgoodenough/pixi.js"

import Frame from "scripts/Frame.js"
import Microgame from "scripts/microgames/Microgame.js"
import Timer from "scripts/Timer.js"

export default class DontTouchMicrogame extends Microgame {
    constructor(stage) {
        super()

        this.addChild(new Art(stage))

        this.addChild(this.timer = new Timer())
    }
    timeout() {
        this.state = "pass"

        for(var i = 0; i < 100; i += 1) {
            this.addChild(new Confetti())
        }
    }
    get wait() {
        return 1000
    }
}

class Art extends Pixi.Sprite {
    constructor(stage = new Number()) {
        var image = Art.images[stage % Art.images.length]
        super(Pixi.Texture.fromImage(image))

        this.interactive = true
        this.on("mousedown", this.interact)
        this.on("touchstart", this.interact)
    }
    update(delta) {
        this.position.x = Frame.width / 2
        this.position.y = Frame.height / 2
    }
    static get images() {
        return [
            require("images/bananaman.png"),
            require("images/avacadoe.png"),
            require("images/pizzaladder.png"),
        ]
    }
    interact(event) {
        this.rotation = Math.PI / 12
        this.state = "fail"

        if(this.parent.hasEnded != true) {
            this.parent.hasEnded = true
            this.parent.timer.duration = 0
        }
    }
}

class Confetti extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(require("images/pixel.png")))

        this.position.x = Math.random() * Frame.width
        this.position.y = -5 * Math.random() - 3

        this.scale.x = 3 * Math.random() + 1
        this.scale.y = 3 * Math.random() + 1

        this.speed = Math.random() * 20

        this.tint = Confetti.colors[Math.floor(Math.random() * Confetti.colors.length)]
    }
    update(delta) {
        this.position.y += this.speed * delta.f
        this.rotation += Math.PI / 16

        this.speed *= 0.9
    }
    static get colors() {
        return [
            0xCC0000,
            0x00CC00,
            0x0000CC,
        ]
    }
}
