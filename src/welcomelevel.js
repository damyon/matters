import PlatformerLevel from './platformerlevel.js';

export default class WelcomeLevel extends PlatformerLevel {
    constructor(name, description, state, x, y) {
        super(name, description, state, x, y);
        this.levelFile = 'assets/levels/welcome/map.json';
    }

    preload(game) {
        super.preload(game);
    }

    characterTalk(sprite, tile) {
        this.say("Cool I can talk!");
        return false;
    }

    create(game) {
        super.create(game);
    }

    unload(game) {
        super.unload(game);
    }

}
