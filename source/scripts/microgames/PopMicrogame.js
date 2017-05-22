import Pixi from "@ehgoodenough/pixi.js"

import Frame from "scripts/Frame.js"
import Microgame from "scripts/microgames/Microgame.js"
import Timer from "scripts/Timer.js"

export default class PopMicrogame extends Microgame {
    constructor(stage = new Number()) {
        super(stage)

        this.addChild(new Background())

        for(var i = 0; i < 5 * (stage + 1); i += 1) {
            this.addChild(new Bubble(stage))
        }

        this.addChild(this.timer = new Timer(10000))
    }
    get wait() {
        return 500
    }
    get prompt() {
        return "POP\nPOP"
    }
    timeout() {
        this.state = "fail"
    }
    get bubbles() {
        return this.children.reduce(function(value, child) {
            return value + (child instanceof Bubble ? 1 : 0)
        }, 0)
    }
}

class Bubble extends Pixi.Sprite {
    constructor(stage = new Number()) {
        super(Pixi.Texture.fromImage(require("images/bubble.png")))

        this.interactive = true
        this.on("pointerdown", this.interact)

        this.tint = Math.random() < 0.33 ? 0xDDFFFF : (Math.random() < 0.33 ? 0xFFDDFF : 0xFFFFDD)

        this.position.x = (Math.random() < 0.5) ? (Math.random() * (this.width) * -1) : (Frame.width + (Math.random() * (this.width)))
        this.position.y = (Math.random() < 0.5) ? (Math.random() * (this.height) * -1) : (Frame.height + (Math.random() * (this.height)))

        this.velocity = new Pixi.Point()
        this.velocity.x = (Math.random() * 0.35 + 0.15) * (Math.random() < 0.5 ? -1 : +1)
        this.velocity.y = (Math.random() * 0.35 + 0.15) * (Math.random() < 0.5 ? -1 : +1)

        this.scale.x = this.scale.y = Math.random() * 0.5 + 0.5
    }
    update(delta) {
        // Translate the bubles via
        // their randomized velocity.
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Bounce the bubbles off the sides of the screen.
        if(this.velocity.x < 0 && this.position.x <= 0) {
            this.velocity.x *= -1
        } if(this.velocity.y < 0 && this.position.y <= 0) {
            this.velocity.y *= -1
        } if(this.velocity.x > 0 && this.position.x >= Frame.width) {
            this.velocity.x *= -1
        } if(this.velocity.y > 0 && this.position.y >= Frame.height) {
            this.velocity.y *= -1
        }
    }
    interact(event) {
        this.microgame = this.parent
        if(this.microgame.hasEnded != true) {
            this.microgame.removeChild(this)
            if(this.microgame.bubbles == 0) {
                this.microgame.timer.duration = 0
                this.microgame.hasEnded = true
                this.microgame.state = "pass"
            }
        }
    }
}

class Background extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(require("images/bubble_bg.png")))
        this.tint = 0x999999
        this.anchor.x = 0
        this.anchor.y = 0
    }
}
