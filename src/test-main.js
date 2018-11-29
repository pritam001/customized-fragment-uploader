
//
// test-main.js
//
import { TapeMachine } from './test-include.js';

const tp = new TapeMachine();
tp.record('Hello... Hellooooo!!! Helloooooo!!!!!');
tp.play();

function TM() {
    return new TapeMachine();
}

window.TapeMachine = TM;
// => Hello... Hellooooo!!! Helloooooo!!!!!