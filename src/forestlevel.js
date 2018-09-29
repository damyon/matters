import PlatformerLevel from './platformerlevel.js';
import Sprite from './sprite.js';

export default class ForestLevel extends PlatformerLevel {
    constructor(name, description, state, x, y) {
        super(name, description, state, x, y);
        this.levelFile = 'assets/levels/forest/map.json';
    }

    preload(game) {
        super.preload(game);
        game.load.atlas('pirate', 'assets/sprites/person1/clean.png', 'assets/sprites/person1/sprites.json');
    }

    contactPirate(game) {
        if (!this.isTalking()) {

            if (this.player.getScore() < this.player.getTargetScore()) {
                this.say("Hi! My name is Bob!");
                this.say("If you collect " + this.player.getTargetScore() + " stars,");
                this.say("I'll give you a roof!");
            } else {
                this.say("Great!");
                this.say("You got all the stars.");
                this.say("Here is your roof!");
                this.waitForTalking().then(function() {
                    this.state.collectTrophy("roof", game);
                    this.setCompleted(true);
                    setTimeout(this.endLevel.bind(this, game), 500);
                }.bind(this));
            }
            
        }
    }

    create(game) {
        super.create(game);

        // Custom character
        this.pirate = new Sprite("pirate");
        this.pirate.setPosition(3880, 1020);
        this.pirate.createSprite(game);
        this.pirate.createAnimations(game.anims);
        this.pirate.handlePlayerContact(this.contactPirate.bind(this, game));
    }

    unload(game) {
        super.unload(game);
        this.pirate.unload(game);
    }

}
