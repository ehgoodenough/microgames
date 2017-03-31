import Pixi from "@ehgoodenough/pixi.js"
import Microgame from "scripts/microgames/Microgame.js"
import Frame from "scripts/Frame.js"

export default class CatchMicrogame extends Microgame {
    constructor() {
        super()
        
        this.addChild(new Background())
        this.addChild(this.stick = new Stick())
    }
    end() {
        this.state = "fail"
    }
}

class Background extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(Background.image))
        
        this.anchor.x = 0
        this.anchor.y = 0
        
        this.scale.x = Frame.width
        this.scale.y = Frame.height
        
        this.tint = 0x222222
        
        this.interactive = true
        this.on("mousedown", (event) => {
            this.parent.children.forEach((child) => {
                if(child.emit instanceof Function) {
                    child.emit("click")
                }
            })
        })
    }
    static get image() {
        return require("images/pixel.png")
    }
}

class Stick extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(Stick.image))

        this.scale.x = 4
        this.scale.y = 48

        this.speed = 0.1
        
        this.position.x = Frame.width / 2
        this.position.y = Frame.height / 4
        
    }
    update(delta) {
        this.position.y += 1 * delta.f
    }
    static get image() {
        return require("images/pixel.png")
    }
}
