import Pixi from "@ehgoodenough/pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

var music = null
// if(music == null) {
//     require(["music/Quirky Dog.mp3"], (source) => {
//         music = new Audio(source)
//         music.volume = 0.25
//         music.loop = true
//         music.play()
//     })
// } else {
//     music.play()
// }

import Frame from "scripts/Frame.js"
import PopMicrogame from "scripts/microgames/PopMicrogame.js"

export default class Game extends Pixi.Container {
    constructor() {
        super()

        this.renderer = Pixi.autoDetectRenderer(Frame.width, Frame.height, {
            transparent: true
        })

        // const WOOT_GREEN = 0x66963F
        // this.addChild(this.prompt = new Pixi.Text("", {
        //     "fontFamily": "Arial", "fontSize": "30px", "fontWeight": "bold",
        //     "align": "center", "fill": WOOT_GREEN, "stroke": 0x111111, "strokeThickness": 5
        // }))
        // this.prompt.position.x = Frame.width / 2
        // this.prompt.position.y = Frame.height / 2
        //
        // this.addChild(this.faster = new Pixi.Text("", {
        //     "fontFamily": "Arial", "fontSize": "50px", "fontWeight": "bold",
        //     "align": "center", "fill": WOOT_GREEN, "stroke": 0x111111, "strokeThickness": 5
        // }))
        // this.faster.rotation = Math.PI / 4
        // this.faster.position.x = Frame.width / 2
        // this.faster.position.y = Frame.height / 2
        // this.flashing = 0

        this.startMicrogame(0)
    }
    startMicrogame(stage) {
        if(this.microgame != undefined) {
            this.removeChild(this.microgame)
        }

        this.microgame = new PopMicrogame(stage)
        this.addChildAt(this.microgame, 0)
    }
    update(delta) {
        if(this.microgame.state == undefined) {
            this.microgame.update(delta)
        } else if(this.microgame.state == "pass") {
            this.startMicrogame(this.microgame.stage + 1)
        } else if(this.microgame.state == "fail") {
            this.startMicrogame(0)
        }
    }
    render() {
        this.renderer.render(this)
    }
}
