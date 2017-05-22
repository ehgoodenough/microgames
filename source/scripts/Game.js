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

        var WOOT_GREEN = 0x66963F
        var TEXT_STYLE = {
            "fontFamily": "Arial", "fontSize": "30px", "fontWeight": "bold",
            "align": "center", "fill": WOOT_GREEN, "stroke": 0x111111, "strokeThickness": 5
        }

        this.addChild(this.message = new Pixi.Text("Hello World!", TEXT_STYLE))
        this.message.position.x = Frame.width
        this.message.position.y = Frame.height / 2
        this.message.anchor.x = 0
        this.message.speed = -2

        this.addChild(this.fanfare = new Pixi.Text("Bubbles popped\nin 10 seconds:", TEXT_STYLE))
        this.fanfare.style.fontSize = "13px"
        this.fanfare.position.x = Frame.width / 2
        this.fanfare.position.y = -1000

        this.addChild(this.score = new Pixi.Text("100", TEXT_STYLE))
        this.score.position.x = Frame.width / 2
        this.score.position.y = 0
        this.score.anchor.y = 0

        this.bubbles = 5
        this.startMicrogame()
    }
    startMicrogame() {
        if(this.microgame != undefined) {
            this.removeChild(this.microgame)
        }

        this.microgame = new PopMicrogame(this.bubbles)
        this.addChildAt(this.microgame, 0)

        this.score.text = 0

        this.sendMessage(this.bubbles + " BUBBLES")
    }
    sendMessage(text) {
        this.message.position.x = Frame.width
        this.message.text = text
    }
    update(delta) {
        if(this.microgame.hasEnded) {
            if(this.microgame.state == "pass") {
                window.setTimeout(() => {
                    this.bubbles += 5
                    this.startMicrogame()
                }, 500)
            } else if(this.microgame.state == "fail") {
                this.score.position.y = Frame.height / 2 + 20
                this.fanfare.position.y = Frame.height / 2

                window.setTimeout(() => {
                    this.score.position.y = 0
                    this.fanfare.position.y = -1000
                    this.bubbles = 5
                    this.startMicrogame()
                }, 1500)
            }
            this.microgame.state = "cool"
        } else {
            this.microgame.update(delta)
        }

        this.message.position.x += this.message.speed * delta.f
    }
    render() {
        this.renderer.render(this)
    }
}
