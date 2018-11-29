//
// codes.js
//
export class TapeMachine {
    constructor() {
        this.recordedMessage = ''
    }
    record(message) {
        this.recordedMessage = message
    }
    play() {
        console.log(this.recordedMessage)
    }
}

const tp = new TapeMachine()
tp.record('Hello... Hellooooo!!! Helloooooo!!!!!')
tp.play()