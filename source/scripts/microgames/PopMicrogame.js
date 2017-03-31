import Pixi from "@ehgoodenough/pixi.js"

import Frame from "scripts/Frame.js"
import Microgame from "scripts/microgames/Microgame.js"
import Timer from "scripts/Timer.js"

export default class PopMicrogame extends Microgame {
    constructor(stage = new Number()) {
        super()
        
        this.addChild(new Background())
        
        this.sounds = {
            "pop": new Audio(require("sounds/bubblePop.wav"))
        }
        
        for(var i = 0; i < 5 * (stage + 1); i += 1) {
            this.addChild(new Bubble(stage))
        }

        this.addChild(this.timer = new Timer(10000))
    }
    timeout() {
        this.state = "fail"
    }
    get wait() {
        return 500
    }
    get prompt() {
        return "POP\nPOP"
    }
}

class Bubble extends Pixi.Sprite {
    constructor(stage = new Number()) {
        super(Pixi.Texture.fromImage(require("images/bubble.png")))

        this.interactive = true
        this.on("mousedown", this.interact)
        this.on("touchstart", this.interact)

        this.tint = Math.random() < 0.33 ? 0xDDFFFF : (Math.random() < 0.33 ? 0xFFDDFF : 0xFFFFDD)

        this.position.x = Math.random() * Frame.width
        this.position.y = Math.random() * Frame.height

        this.velocity = new Pixi.Point()
        this.velocity.x = (Math.random() * 0.25 + 0.25) * (Math.random() < 0.5 ? -1 : +1)
        this.velocity.y = (Math.random() * 0.25 + 0.25) * (Math.random() < 0.5 ? -1 : +1)

        this.scale.x = this.scale.y = Math.random() * 0.5 + 0.5
    }
    update(delta) {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // this.rotation += Math.PI / 32

        if(this.position.x <= 0) {
            this.velocity.x *= -1
        } if(this.position.y <= 0) {
            this.velocity.y *= -1
        } if(this.position.x >= Frame.width) {
            this.velocity.x *= -1
        } if(this.position.y >= Frame.height) {
            this.velocity.y *= -1
        }
    }
    interact(event) {
        if(this.parent.hasEnded != true) {

            if(this.parent.children.length <= 3) {
                this.parent.timer.duration = 0
                this.parent.hasEnded = true
                this.parent.state = "pass"
            }

            if(this.parent.sounds) {
                this.parent.sounds.pop.currentTime = 0
                this.parent.sounds.pop.volume = 0.25
                this.parent.sounds.pop.play()
            }
            
            this.parent.removeChild(this)
        }
    }
}

class Background extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(require("images/bubble_bg.png")))
        
        this.anchor.x = 0
        this.anchor.y = 0
        
        this.tint = 0xAAAAAA
    }
}
