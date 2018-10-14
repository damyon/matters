import PlatformerLevel from './platformerlevel.js';
import Sprite from './sprite.js';

export default class VillageLevel extends PlatformerLevel {
    constructor(name, description, state, x, y) {
        super(name, description, state, x, y);
        this.levelFile = 'assets/levels/village/map.json';
        this.trophiesNeeded = 4;
        this.houseName = 'house';
    }

    preload(game) {
        super.preload(game);
        game.load.atlas('pirate', 'assets/sprites/person1/clean.png', 'assets/sprites/person1/sprites.json');
        let filename = 'assets/trophies/house.png';
        game.load.image(this.houseName, filename);
    }

    buildHouse(game) {
        //this.house = game.add.image(1040, 800, this.houseName);
        this.house.setVisible(true);
    }

    contactPirate(game) {
        if (!this.isTalking()) {
            if (true) {
            // if (this.state.countTrophies() >= 4) {
                this.say("Lets build your house!");
                this.buildHouse(game);
                this.waitForTalking().then(function() {
                    this.setCompleted(true);
                    setTimeout(this.endLevel.bind(this, game), 10000);
                }.bind(this));
            } else {
                this.say("Hi! It's me Pete again!");
                this.say("You need to collect");
                this.say("more parts");
                this.say("to build a house");
            }
        }
    }

    create(game) {
        super.create(game);

        let position = this.getCharacterPosition(0);
        // Custom character
        this.pirate = new Sprite("pirate");
        this.pirate.setPosition(position.x, position.y);
        this.pirate.createSprite(game);
        this.pirate.createAnimations(game.anims);
        this.pirate.handlePlayerContact(this.contactPirate.bind(this, game));

    }

    createImages(game) {
        this.house = game.add.image(1040, 800, this.houseName);
        this.house.setVisible(false);
    }

    unload(game) {
        super.unload(game);
        this.pirate.unload(game);
        this.house.destroy(game);
    }

    updateScoreText() {
        let s = this.state.countTrophies() + ' / ' + this.trophiesNeeded;
        this.scoreText.setText(s);
    }
}
