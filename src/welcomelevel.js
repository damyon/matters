import PlatformerLevel from './platformerlevel.js';
import Sprite from './sprite.js';

export default class WelcomeLevel extends PlatformerLevel {
    constructor(name, description, state, x, y) {
        super(name, description, state, x, y);
        this.levelFile = 'assets/levels/welcome/map.json';
    }

    preload(game) {
        super.preload(game);
        game.load.atlas('pirate', 'assets/sprites/person1/clean.png', 'assets/sprites/person1/sprites.json');
    }

    contactPirate() {
        if (!this.isTalking()) {
            this.say("Arghh!");
        }
    }

    create(game) {
        super.create(game);

        // Custom character
        this.pirate = new Sprite("pirate");
        this.pirate.setPosition(600, 1100);
        this.pirate.createSprite(game);
        this.pirate.createAnimations(game.anims);
        this.pirate.handlePlayerContact(this.contactPirate.bind(this));
    }

    unload(game) {
        super.unload(game);
    }

}
