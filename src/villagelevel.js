import PlatformerLevel from './platformerlevel.js';
import Sprite from './sprite.js';

export default class VillageLevel extends PlatformerLevel {
    constructor(name, description, state, x, y) {
        super(name, description, state, x, y);
        this.levelFile = 'assets/levels/village/map.json';
    }

    preload(game) {
        super.preload(game);
        game.load.atlas('pirate', 'assets/sprites/person1/clean.png', 'assets/sprites/person1/sprites.json');
    }

    contactPirate(game) {
        if (!this.isTalking()) {
            this.say("Hi! My name is Pete!");
            this.say("Lets build a house.");
        }
    }

    create(game) {
        super.create(game);

        // Custom character
        this.pirate = new Sprite("pirate");
        this.pirate.setPosition(3880, 880);
        this.pirate.createSprite(game);
        this.pirate.createAnimations(game.anims);
        this.pirate.handlePlayerContact(this.contactPirate.bind(this, game));
    }

    unload(game) {
        super.unload(game);
        this.pirate.unload(game);
    }

}
