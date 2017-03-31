import Pixi from "@ehgoodenough/pixi.js"
import Frame from "scripts/Frame.js"

export default class Microgame extends Pixi.Container {
    constructor() {
        super(null)
    }

    // A method that is called
    // with each frame of the game.
    // You should extend this method
    // with your gameplay functionality.
    update(delta) {
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
    
    get isDone() {
        return this.timer.duration <= -1 * this.wait
    }
    
    get wait() {
        return 500
    }
}
