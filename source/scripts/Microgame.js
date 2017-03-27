import * as Pixi from "pixi.js"

export default class Microgame extends Pixi.Container {
    constructor() {
        super()
    }

    // A method that is called
    // with each frame of the game.
    // You should override this with
    // your own gameplay functionality.
    update(delta) {
        // ...
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
}
