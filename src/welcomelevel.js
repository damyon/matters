import PlatformerLevel from './platformerlevel.js';

export default class WelcomeLevel extends PlatformerLevel {
    constructor(name, description, state, x, y) {
        super(name, description, state, x, y);
        this.levelFile = 'assets/levels/welcome/map.json';
    }

    preload(game) {
        super.preload(game);

       // game.load.image('character', 'assets/sprites/intro/character.png');
    }

    characterTalk(sprite, tile) {
        this.say("Cool I can talk!");
        return false;
    }

    create(game) {
        super.create(game);
        // Custom characters.
        /*
        var personTiles = this.map.addTilesetImage('character');
        this.personLayer = this.map.createDynamicLayer('Character', personTiles, 0, 0);

        // find the index of the sprite image.
        var i = 0, spriteTileIndex = -1;
        for (i = 0; i < 1000; i++) {
            if (this.personLayer.tileset.containsTileIndex(i)) {
                // found it!
                spriteTileIndex = i;
                break;
            }
        } 
  
        this.personLayer.setTileIndexCallback(spriteTileIndex, this.characterTalk, this);

        // when the player overlaps with a tile
        this.personCollider = game.physics.add.overlap(this.player.getSprite(), this.personLayer);
        */
    }

    unload(game) {
        super.unload(game);
       // this.personCollider.destroy();
    }

}
