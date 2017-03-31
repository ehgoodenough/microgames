import Pixi from "@ehgoodenough/pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

import RunMicrogame from "scripts/microgames/RunMicrogame.js"
import ShootMicrogame from "scripts/microgames/ShootMicrogame.js"
import DontTouchMicrogame from "scripts/microgames/DontTouchMicrogame.js"
import PopMicrogame from "scripts/microgames/PopMicrogame.js"

import Frame from "scripts/Frame.js"

var MICROGAMES = [
    DontTouchMicrogame,
    // RunMicrogame,
    // ShootMicrogame,
    // PopMicrogame,
]

export default class Game extends Pixi.Container {
    constructor() {
        super()

        this.renderer = Pixi.autoDetectRenderer(Frame.width, Frame.height, {
            transparent: true
        })
        
        this.addChild(this.leftdoor = new ElevatorDoor())
        this.addChild(this.rightdoor = new ElevatorDoor())
        this.addChild(this.elevator = new Elevator())
        
        this.leftdoor.anchor.x = 1
        this.leftdoor.position.x = 0
        
        this.rightdoor.anchor.x = 0
        this.rightdoor.position.x = Frame.width
        this.rightdoor.tint = 0xEEEEEE
        
        this.startMicrogame()
    }
    update(delta) {
        this.elevator.update(delta)
        
        if(this.elevator.isActive == false) {
            this.microgame.update(delta)
        }
    }
    render() {
        this.renderer.render(this)
    }
    startMicrogame() {
        if(this.microgame != undefined) {
            this.removeChild(this.microgame)
        }

        if(this.microgames == null
        || this.microgames.length == 0) {
            this.microgames = MICROGAMES.slice()
            // TODO: filter unplayable
            // TODO: randomly shuffle

            this.stage = isNaN(this.stage) ? 0 : this.stage + 1
        }

        var Microgame = this.microgames.shift()

        this.microgame = new Microgame(this.stage)
        this.addChildAt(this.microgame, 0)
    }
}

class Elevator extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(require("images/elevator.outer.1.png")))
        
        this.position.x = Frame.width / 2
        this.position.y = Frame.height / 2
        
        this.isActive = false
        this.scale.x = 2
        this.scale.y = 2
        
        this.speed = 0.05
    }
    update(delta) {
        if(this.parent.microgame.isDone) {
            this.isActive = true
            if(this.scale.x != 1
            || this.scale.y != 1) {
                if(this.scale.x > 1) {
                    this.scale.x -= this.speed * delta.f
                    if(this.scale.x < 1) {
                        this.scale.x = 1
                    }
                }
                if(this.scale.y > 1) {
                    this.scale.y -= this.speed * delta.f
                    if(this.scale.y < 1) {
                        this.scale.y = 1
                    }
                }
            } else {
                // SET THE TEXTURE FOR THE IMAGE HERE
                // MAKE IT EITHER HAPPY OR SAD DEPENDNING
                // ON THIS.MICROGAME.STATE
                
                if(this.parent.leftdoor.anchor.x != 0
                || this.parent.rightdoor.anchor.x != 1) {
                    if(this.parent.leftdoor.anchor.x > 0) {
                        this.parent.leftdoor.anchor.x -= (this.speed / 2) * delta.f
                        if(this.parent.leftdoor.anchor.x < 0) {
                            this.parent.leftdoor.anchor.x = 0
                        }
                    }
                    if(this.parent.rightdoor.anchor.x < 1) {
                        this.parent.rightdoor.anchor.x += (this.speed / 2) * delta.f
                        if(this.parent.rightdoor.anchor.x > 1) {
                            this.parent.rightdoor.anchor.x = 1
                        }
                    }
                } else {
                    this.parent.microgame.timer.duration -= delta.ms
                    if(this.parent.microgame.timer.duration < -1 * this.parent.microgame.wait - 500) {
                        this.parent.startMicrogame()
                    }
                }
            }
        } else {
            if(this.parent.leftdoor.anchor.x != 1
            || this.parent.rightdoor.anchor.x != 0) {
                if(this.parent.rightdoor.anchor.x > 0) {
                    this.parent.rightdoor.anchor.x -= (this.speed / 2) * delta.f
                    if(this.parent.rightdoor.anchor.x < 0) {
                        this.parent.rightdoor.anchor.x = 0
                    }
                }
                if(this.parent.leftdoor.anchor.x < 1) {
                    this.parent.leftdoor.anchor.x += (this.speed / 2) * delta.f
                    if(this.parent.leftdoor.anchor.x > 1) {
                        this.parent.leftdoor.anchor.x = 1
                    }
                }
            } else {
                if(this.scale.x != 2
                || this.scale.y != 2) {
                    if(this.scale.x < 2) {
                        this.scale.x += this.speed * delta.f
                        if(this.scale.x > 2) {
                            this.scale.x = 2
                        }
                    }
                    if(this.scale.y < 2) {
                        this.scale.y += this.speed * delta.f
                        if(this.scale.y > 2) {
                            this.scale.y = 2
                        }
                    }
                } else {
                    this.isActive = false
                }
            }
        }
    }
}

class ElevatorDoor extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(require("images/pixel.png")))
        console.log(Frame)
        this.scale.x = Frame.width / 2
        this.scale.y = Frame.height
        
        this.anchor.y = 0
    }
}
