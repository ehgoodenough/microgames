import Pixi from "@ehgoodenough/pixi.js"

export default class Microgame extends Pixi.Container {
    constructor() {
        super(null)

        this.timer = 5 * 1000
        this.maxtimer = 5 * 1000

        this.addChild(new Timer())
    }

    // A method that is called
    // with each frame of the game.
    // You should extend this method
    // with your gameplay functionality.
    update(delta) {
        // Decrement the timer.
        this.timer -= delta.ms

        // Check if the timer
        // has reached zero.
        if(this.timer <= 0) {
            // If it has, then
            // end the microgame.
            if(this.hasEnded != true) {
                this.hasEnded = true
                this.end()
            }
        }

        // Iterate through all the
        // elements in the game, and
        // update them.
        this.children.forEach((child) => {
            if(child.update instanceof Function) {
                child.update(delta)
            }
        })
    }

    // A static method that indicates
    // whether this microgame can be
    // played on this device. If your
    // microgame requires a certain
    // environment to be played, you
    // can override this method and
    // perform some tests to verify
    // if you have that environment.
    static get isPlayable() {
        return true
    }

    // A static method for
    // instantiating this
    // microgame. Just a
    // bit of sugar.
    static instantiate() {
        return new this()
    }

    end() {
        return
    }
}

const FRAME = 160

class Timer extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(Timer.image))

        this.anchor.x = 0
        this.anchor.y = 1

        this.position.y = FRAME

        this.scale.x = FRAME
        this.scale.y = 4
    }
    static get image() {
        return require("images/pixel.png")
    }
    update(delta) {
        this.width = Math.max((this.parent.timer / this.parent.maxtimer) * FRAME, 0)
    }
}
