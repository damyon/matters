import 'phaser';
import State from './state.js';

var state = new State();
var config = {
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
    },
};

var game = new Phaser.Game(config);
var keys = null;
var player = null;

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
