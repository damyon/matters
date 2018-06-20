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

            if (this.player.getScore() < this.player.getTargetScore()) {
                this.say("Hi! My name is Pete!");
                this.say("If you collect 10 stars,");
                this.say("I'll give you a door!");
            } else {
                this.say("Great!");
                this.say("You got all the stars.");
                this.say("Here is your door!");
            }


            
        }
    }

    create(game) {
        super.create(game);

        // Custom character
        this.pirate = new Sprite("pirate");
        this.pirate.setPosition(3800, 1080);
        this.pirate.createSprite(game);
        this.pirate.createAnimations(game.anims);
        this.pirate.handlePlayerContact(this.contactPirate.bind(this));
    }

    unload(game) {
        super.unload(game);
        this.pirate.unload(game);
    }

}
