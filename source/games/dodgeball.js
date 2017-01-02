exports = module.exports = {
    time: 5000,
    onTimeOut: function() {
        console.log("time's up!")
        return "pass"
    },
    onStart: function() {
        console.log("starting!!")
    },
    onUpdate: function(delta) {
        console.log("tick tock!!")
    },
}
