import 'phaser';
import State from './state.js';

let state = new State();
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: "matter"
    }/*,
    audio: {
        disableWebAudio: true
    }*/
};

let game = new Phaser.Game(config);
let keys = null;
let player = null;

function preload ()
{
    state.preload(this);
}

function update() {
    state.update(this);
    state.getCurrentLevel().update(this);    
}

function create ()
{
    state.create(this);
}
