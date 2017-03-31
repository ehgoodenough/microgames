import Pixi from "@ehgoodenough/pixi.js"

import Frame from "scripts/Frame.js"
import Microgame from "scripts/microgames/Microgame.js"
import Timer from "scripts/Timer.js"

export default class RunMicrogame extends Microgame {
    constructor(stage = new Number()) {
        super()

        this.addChild(new Background1(stage))
        this.addChild(new Background2(stage))
        this.addChild(new Floor({x: 0}, stage))
        this.addChild(new Floor({x: 100}, stage))
        this.addChild(new Floor({x: 250}, stage))
        this.addChild(new Floor({x: 400}, stage))
        this.addChild(new Floor({x: 550}, stage))
        this.addChild(new Floor({x: 650}, stage))
        this.addChild(new Floor({x: 800}, stage))
        this.addChild(new Floor({x: 900}, stage))
        this.addChild(new Floor({x: 1000}, stage))
        this.addChild(new Floor({x: 1100}, stage))
        this.addChild(new Runner(stage))

        this.addChild(this.timer = new Timer())
    }
    timeout() {
        this.state = "pass"
    }
    get prompt() {
        return "RUN N'\nJUMP"
    }
}

class Background1 extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(require("images/run.background.1.png")))

        this.anchor.x = 0
        this.anchor.y = 0

        this.interactive = true
        this.on("mousedown", this.interact)
        this.on("touchstart", this.interact)
    }
    interact() {
        this.parent.children.forEach((child) => {
            if(child.send instanceof Function) {
                child.send("interact")
            }
        })
    }
}

class Background2 extends Pixi.Sprite {
    constructor(stage = new Number()) {
        super(Pixi.Texture.fromImage(require("images/run.background.2.png")))

        this.anchor.x = 0
        this.anchor.y = 0

        this.speed = 0.33
    }
    update(delta) {
        if(this.parent.timer.duration > 0) {
            this.position.x -= this.speed * delta.f
        }
    }
}

class Floor extends Pixi.Sprite {
    constructor(that, stage = new Number()) {
        super(Pixi.Texture.fromImage(require("images/run.floor.png")))

        this.anchor.x = 0
        this.anchor.y = 1

        this.position.x = that.x || 0
        this.position.y = Frame.height

        this.speed = 2 + stage
        this.isPermeable = true
    }
    update(delta) {
        if(this.parent.timer.duration > 0) {
            this.position.x -= this.speed * delta.f
        }
    }
}

class Runner extends Pixi.Sprite {
    constructor(stage = new Number()) {
        super(Pixi.Texture.fromImage(require("images/runner.1.png")))

        this.textures = [
            Pixi.Texture.fromImage(require("images/runner.1.png")),
            Pixi.Texture.fromImage(require("images/runner.2.png")),
        ]

        this.anchor.y = 1

        this.position.x = Frame.width / 3
        this.position.y = Frame.height * (2/3)

        this.velocity = new Pixi.Point()
        this.gravity = 0.5

        this.animation = 0
    }
    update(delta) {

        this.velocity.y += this.gravity * delta.f

        this.parent.children.forEach((child) => {
            if(child.isPermeable) {
                if(child.position.x < this.position.x + this.velocity.x
                && child.position.x + child.width > this.position.x + this.velocity.x
                && child.position.y > this.position.y + this.velocity.y
                && child.position.y - child.height < this.position.y + this.velocity.y) {
                    if(Math.abs((child.position.y - child.height) - this.position.y) < 23) {
                        this.position.y = child.position.y - child.height
                        this.velocity.y = 0
                    }
                }
            }
        })

        this.position.x += this.velocity.x * delta.f
        this.position.y += this.velocity.y * delta.f

        if(this.position.y > Frame.height + this.height) {
            this.parent.state = "fail"

            if(this.parent.hasEnded != true) {
                this.parent.hasEnded = true
                this.parent.timer.duration = 0
            }
        }

        if(this.velocity.y == 0 && this.position.y == Math.round(Frame.height * (2/3))) {
            this.animation += delta.ms
            this.texture = this.textures[Math.floor(this.animation / 100) % 2]
        }
    }
    send(message) {
        if(message == "interact") {
            if(this.velocity.y == 0
            && this.position.y == Math.round(Frame.height * (2/3))) {
                this.velocity.y = -10
            }
        }
    }
}
