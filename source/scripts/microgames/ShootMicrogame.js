

import Pixi from "@ehgoodenough/pixi.js"
import Microgame from "scripts/microgames/Microgame.js"
import Frame from "scripts/Frame.js"

export default class RunMicrogame extends Microgame {
    constructor(stage = new Number()) {
        super()

        this.addChild(new Defender(stage))
        this.addChild(new Invader(stage, 0))
        this.addChild(new Invader(stage, 1))
        this.addChild(new Invader(stage, 2))
        this.addChildAt(new Background(), 0)
    }
    timeout() {
        this.state = "pass"
    }
}

class Background extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(require("images/pixel.png")))

        this.anchor.x = 0
        this.anchor.y = 0

        this.tint = 0x222222

        this.scale.x = Frame.width
        this.scale.y = Frame.height

        this.interactive = true
        this.on("mousedown", (event) => {
            this.parent.children.forEach((child) => {
                if(child.send instanceof Function) {
                    child.send("click")
                }
            })
        })
    }
}

class Invader extends Pixi.Sprite {
    constructor(stage = new Number(), index = new Number()) {
        super(Pixi.Texture.fromImage(require("images/invader.png")))

        this.position.x = (Frame.width / 3) * index + 19
        this.position.y = 16

        if(index == 0) {
            this.speed = 0.75
        } else if(index == 1) {
            this.speed = 0.25
        } else if(index == 2) {
            this.speed = 0.5
        }
    }
    update(delta) {
        this.position.y += this.speed * delta.f
    }
}

class Defender extends Pixi.Sprite {
    constructor(stage = new Number()) {
        super(Pixi.Texture.fromImage(require("images/defender.png")))

        this.scale.x = 0.75
        this.scale.y = 0.75

        this.position.x = Frame.width - 16
        this.position.y = Frame.height - 36

        this.velocity = new Pixi.Point()

        this.recharging = 0
        this.maxrecharging = 500

        this.speed = 1
    }
    update(delta) {
        if(this.velocity.x === 0) {
            this.velocity.x = -1 * this.speed
        }

        if(this.position.x + this.velocity.x > Frame.width - 16
        || this.position.x + this.velocity.x < 0 + 16) {
            this.velocity.x *= -1
        }

        this.position.x += this.velocity.x

        this.recharging -= delta.ms
        if(this.recharging < 0) {
            this.recharging = 0
        }

        this.rotation = (this.recharging / this.maxrecharging) * 2 * Math.PI
        this.tint = this.recharging > 0 ? 0x888888 : 0xFFFFFF
    }
    send(message) {
        if(message == "click") {
            if(this.recharging === 0) {
                this.recharging = this.maxrecharging
                this.parent.addChild(new Projectile({
                    position: {
                        x: this.position.x,
                        y: this.position.y - (this.height / 2)
                    }
                }))
            }
        }
    }
}

class Projectile extends Pixi.Sprite {
    constructor(protoprojectile = new Object()) {
        super(Pixi.Texture.fromImage(require("images/pixel.png")))

        this.position.x = protoprojectile.position.x || 0
        this.position.y = protoprojectile.position.y || 0

        this.scale.x = 16
        this.scale.y = 16

        this.speed = 2
    }
    update(delta) {
        this.position.y -= this.speed * delta.f
        this.rotation += Math.PI / 16

        this.parent.children.forEach((child) => {
            if(child instanceof Invader) {
                if(getDistance(this.position, child.position) < 15) {
                    this.parent.removeChild(child)
                    this.parent.removeChild(this)
                }
            }
        })
    }
}

function getDistance(a, b) {
    var x = a.x - b.x
    var y = a.y - b.y
    return Math.sqrt(x*x + y*y)
}
