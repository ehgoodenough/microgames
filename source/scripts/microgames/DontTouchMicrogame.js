import Pixi from "@ehgoodenough/pixi.js"

import Frame from "scripts/Frame.js"
import Microgame from "scripts/microgames/Microgame.js"
import Timer from "scripts/Timer.js"

export default class DontTouchMicrogame extends Microgame {
    constructor(stage = new Number) {
        super()

        this.addChild(new Background())
        this.addChild(new Art(stage))

        this.addChild(this.timer = new Timer((4 - stage) * 1000))
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
    get prompt() {
        return "Don't\nTouch"
    }
}

class Art extends Pixi.Sprite {
    constructor(stage = new Number()) {
        var image = Art.images[stage % Art.images.length]
        super(Pixi.Texture.fromImage(image))

        this.interactive = true
        this.on("mousedown", this.interact)
        this.on("touchstart", this.interact)

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
        if(this.parent.hasEnded != true) {
            this.rotation = Math.PI / 12
            this.parent.state = "fail"

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

class Background extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(require("images/pixel.png")))

        this.anchor.x = 0
        this.anchor.y = 0
        this.scale.x = Frame.width
        this.scale.y = Frame.height

        this.tint = 0xAAAAAA
    }
}
