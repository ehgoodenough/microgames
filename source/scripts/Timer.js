import Pixi from "@ehgoodenough/pixi.js"
import Frame from "scripts/Frame.js"

export default class Timer extends Pixi.Sprite {
    constructor(duration = 5 * 1000) {
        super(Pixi.Texture.fromImage(Timer.image))

        this.anchor.x = 0
        this.anchor.y = 1

        this.position.y = Frame.height
        this.scale.x = Frame.width
        this.scale.y = 4

        this.stack = 100

        this.duration = duration
        this.maxduration = duration
    }
    static get image() {
        return require("images/pixel.png")
    }
    update(delta) {
        // Decrement the timer.
        this.duration -= delta.ms

        // Check if the timer
        // has reached zero.
        if(this.duration <= 0) {
            // If it has, then
            // end the microgame.
            if(this.parent.hasEnded != true) {
                this.parent.hasEnded = true
                this.parent.timeout()
            }
        }

        this.width = Math.max((this.duration / this.maxduration) * Frame.width, 0)
    }
}
