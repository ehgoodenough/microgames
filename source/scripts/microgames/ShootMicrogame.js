import Pixi from "@ehgoodenough/pixi.js"

import Frame from "scripts/Frame.js"
import Microgame from "scripts/microgames/Microgame.js"
import Timer from "scripts/Timer.js"

export default class ShootMicrogame extends Microgame {
    constructor(stage = new Number()) {
        super()

        this.addChild(new Background())

        for(var i = 0; i < 50; i += 1) {
            this.addChild(new Star(stage, i))
        }

        this.addChild(this.defender = new Defender(stage))

        this.addChild(new Invader(stage, 0))
        this.addChild(new Invader(stage, 1))
        this.addChild(new Invader(stage, 2))

        this.addChild(this.timer = new Timer())

        this.score = 0
    }
    timeout() {
        this.state = "fail"
    }
    get wait() {
        return this.state == "pass" ? 1500 : 500
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

class Invader extends Pixi.Sprite {
    constructor(stage = new Number(), index = new Number()) {
        super(Pixi.Texture.fromImage(require("images/invader.png")))

        this.position.x = (Frame.width / 3) * index + 19
        this.position.y = 16

        if(index == 0) {
            this.speed = 0.8
        } else if(index == 1) {
            this.speed = 0.4
        } else if(index == 2) {
            this.speed = 0.6
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

        this.speed = stage + 1
    }
    update(delta) {
        if(this.parent.hasEnded) {

            if(this.parent.state == "pass") {
                if(this.parent.timer.duration < -500) {
                    this.position.y -= this.speed * 5
                }
            }

            this.rotation = 0
            this.tint = 0xFFFFFF
        } else {
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
    }
    send(message) {
        if(message == "interact") {
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
                if(getDistance(this.position, child.position) < 18) {

                    this.parent.score += 1
                    if(this.parent.score == 3) {
                        if(this.parent.hasEnded != true) {
                            this.parent.state = "pass"
                            this.parent.hasEnded = true
                            this.parent.timer.duration = 0
                        }
                    }

                    this.parent.removeChild(child)
                    this.parent.removeChild(this)
                }
            }
        })
    }
}

class Star extends Pixi.Sprite {
    constructor(stage, index) {
        super(Pixi.Texture.fromImage(require("images/pixel.png")))

        var color = Star.colors[Math.floor(Math.random() * Star.colors.length)]
        this.tint = color

        this.scale.x = 1
        this.scale.y = 1

        this.position.x = Math.random() * Frame.width
        this.position.y = Math.random() * Frame.height

        this.speed = (Math.random() * 2) + stage
    }
    update(delta) {
        this.position.y += this.speed * delta.f

        if(this.position.y > Frame.height) {
            this.position.y -= Frame.height
            this.position.x = Math.random() * Frame.width
        }
    }
    static get colors() {
        return [
            0xE5E4E2,
            0xC44040,
            0xD89000,
            0x339D33,
            0x4A508A
        ]
    }
}

function getDistance(a, b) {
    var x = a.x - b.x
    var y = a.y - b.y
    return Math.sqrt(x*x + y*y)
}
