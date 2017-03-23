import * as Pixi from "pixi.js"

export default class Game extends Pixi.Container {
    constructor() {
        super()

        this.microgame = new Microgame()

        this.addChild(this.microgame)
    }
    update(delta) {
        if(this.microgame != undefined) {
            this.microgame.update(delta)
        }
    }
}

class Microgame extends Pixi.Container {
    constructor() {
        super()
    }
    update(delta) {
        console.log("!")
    }
}
