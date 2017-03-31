import Pixi from "@ehgoodenough/pixi.js"
Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST

import RunMicrogame from "scripts/microgames/RunMicrogame.js"
import ShootMicrogame from "scripts/microgames/ShootMicrogame.js"
import DontTouchMicrogame from "scripts/microgames/DontTouchMicrogame.js"
import PopMicrogame from "scripts/microgames/PopMicrogame.js"

import Frame from "scripts/Frame.js"
const WOOT_GREEN = 0x66963F

var MICROGAMES = [
    PopMicrogame,
    RunMicrogame,
    ShootMicrogame,
    DontTouchMicrogame,
]

var music = null
if(music == null) {
    require(["music/Quirky Dog.mp3"], (source) => {
        music = new Audio(source)
        music.volume = 0.25
        music.loop = true
        music.play()
    })
} else {
    music.play()
}

export default class Game extends Pixi.Container {
    constructor() {
        super()

        this.renderer = Pixi.autoDetectRenderer(Frame.width, Frame.height, {
            transparent: true
        })
        
        this.addChild(this.leftdoor = new ElevatorDoor("left"))
        this.addChild(this.rightdoor = new ElevatorDoor("right"))
        this.addChild(this.elevator = new Elevator())
        
        this.addChild(this.prompt = new Pixi.Text("", {
            "fontFamily": "Arial", "fontSize": "30px", "fontWeight": "bold",
            "align": "center", "fill": WOOT_GREEN, "stroke": 0x111111, "strokeThickness": 5
        }))
        this.prompt.position.x = Frame.width / 2
        this.prompt.position.y = Frame.height / 2
        
        this.addChild(this.faster = new Pixi.Text("", {
            "fontFamily": "Arial", "fontSize": "50px", "fontWeight": "bold",
            "align": "center", "fill": WOOT_GREEN, "stroke": 0x111111, "strokeThickness": 5
        }))
        this.faster.rotation = Math.PI / 4
        this.faster.position.x = Frame.width / 2
        this.faster.position.y = Frame.height / 2
        this.flashing = 0
        
        this.leftdoor.anchor.x = 1
        this.leftdoor.position.x = 0
        
        this.rightdoor.anchor.x = 0
        this.rightdoor.position.x = Frame.width
        this.rightdoor.tint = 0xEEEEEE
        
        this.hearts = 3
        
        this.startMicrogame()
    }
    update(delta) {
        this.elevator.update(delta)
        
        if(this.elevator.isActive == false) {
            this.microgame.update(delta)
        }
        
        this.flashing += delta.ms
        this.faster.position.x = Math.floor(this.flashing / 100) % 2 == 0 ? Frame.width / 2 : 1000
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

class Heart extends Pixi.Sprite {
    constructor(index) {
        super(Pixi.Texture.fromImage("images/heart.png"))
        
        
    }
}

class Elevator extends Pixi.Sprite {
    constructor() {
        super(Pixi.Texture.fromImage(require("images/elevator.outer.1.png")))
        
        this.position.x = Frame.width / 2
        this.position.y = Frame.height / 2
        
        this.isActive = false
        this.scale.x = 2.5
        this.scale.y = 2.5
        
        this.speed = 0.05
        
        this.animation = 0
        
        this.textures = [
            Pixi.Texture.fromImage(require("images/elevator.outer.1.png")),
            Pixi.Texture.fromImage(require("images/elevator.outer.2.png")),
        ]
    }
    update(delta) {
        this.animation += delta.ms
        this.texture = this.textures[Math.floor(this.animation / 300) % 2]
        
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
                
                var state = this.parent.microgame.state || "pass"
                
                this.parent.leftdoor.texture = DOORS["left"][state]
                this.parent.rightdoor.texture = DOORS["right"][state]
                
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
                    var state = this.parent.microgame.state
                    
                    
                    this.parent.microgame.timer.duration -= delta.ms
                    
                    var isGameOver = (state == "fail") && this.hearts == 1
                    
                    if(this.parent.microgames.length == 0 || isGameOver) {
                        
                        if(this.parent.stage >= 2 || isGameOver) {
                            this.parent.faster.text = isGameOver ? "YOU LOST :<" : "YOU WIN!! :D"
                            this.parent.microgame.timer.duration = -1 * this.parent.microgame.wait
                            if(!!music) {
                                music.playbackRate = 1
                            }
                        } else {
                            this.parent.faster.text = "FASTER"
                            
                            if(this.parent.microgame.timer.duration < -1 * this.parent.microgame.wait - 1000) {
                                this.parent.faster.text = ""
                                if(!!music) {
                                    music.playbackRate = 1 + ((this.parent.stage + 1) * 0.5)
                                }
                            }
                        }
                    }
                    
                    var extrawait = this.parent.microgames.length == 0 ? 2000 : 500
                    if(this.parent.microgame.timer.duration < -1 * this.parent.microgame.wait - extrawait) {
                        
                        if(state == "fail") {
                            this.parent.hearts -= 1
                            console.log(this.parent.hearts)
                            if(this.parent.hearts <= 0) {
                                window.location = window.location
                            }
                        }
                        
                        this.parent.startMicrogame()
                        this.parent.prompt.text = (this.parent.microgame.prompt || "Do It").toUpperCase()
                        this.parent.prompt.position.x = 0 - (this.parent.prompt.width / 2)
                    }
                    
                }
            }
        } else {
            if(this.parent.prompt.position.x < Frame.width / 2) {
                this.parent.prompt.position.x += 5 * delta.f
            }
            if(!!music) {
                // music.volume = 0.5
            }
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
                if(this.scale.x != 2.5
                || this.scale.y != 2.5) {
                    if(this.scale.x < 2.5) {
                        this.scale.x += this.speed * delta.f
                        if(this.scale.x > 2.5) {
                            this.scale.x = 2.5
                        }
                    }
                    if(this.scale.y < 2.5) {
                        this.scale.y += this.speed * delta.f
                        if(this.scale.y > 2.5) {
                            this.scale.y = 2.5
                        }
                    }
                } else {
                    this.isActive = false
                }
            }
        }
    }
}

var DOORS = {
    left: {
        pass: Pixi.Texture.fromImage(require("images/elevator.door.pass.1.png")),
        fail: Pixi.Texture.fromImage(require("images/elevator.door.fail.1.png"))
    },
    right: {
        pass: Pixi.Texture.fromImage(require("images/elevator.door.pass.2.png")),
        fail: Pixi.Texture.fromImage(require("images/elevator.door.fail.2.png"))
    }
}

class ElevatorDoor extends Pixi.Sprite {
    constructor(side = "left") {
        super(DOORS[side]["pass"])
        
        this.side = side
        
        // this.scale.x = Frame.width / 2
        // this.scale.y = Frame.height
        
        this.anchor.y = 0
    }
}
