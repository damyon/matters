import Level from './level.js'; 
import PlatformerPlayer from './platformerplayer.js';

export default class PlatformerLevel extends Level {
    preload(game) {

        // map made with Tiled in JSON format
        game.load.tilemapTiledJSON('map' + this.name, this.levelFile);
        // tiles in spritesheet 
        game.load.spritesheet('tiles', 'assets/maps/tiles.png', {frameWidth: 72, frameHeight: 72});
      
        game.load.atlas('player', 'assets/sprites/player/sheet.png', 'assets/sprites/player/sprites.json');
    }

    getNextLevels() {
        return this.nextLevels;
    }

    getPreviousLevels() {
        return this.previousLevels;
    }

    addNextLevel(nextLevel) {
        this.nextLevels[this.nextLevels.length] = nextLevel;
        nextLevel.addPreviousLevel(this);
    }

    addPreviousLevel(previousLevel) {
        this.previousLevels[this.previousLevels.length] = previousLevel;
    }

    getCompleted() {
        return this.completed;
    }

    say(text) {
        if (this.talkQueue.indexOf(text) == -1) {
           this.talkQueue.push(text);
        }
    }

    createCamera(game) {
        // set bounds so the camera won't go outside the game world
        game.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        // make the camera follow the player
        game.cameras.main.startFollow(this.player.getSprite());
 
        // set background color, so the sky is not black    
        game.cameras.main.setBackgroundColor(0xccccff);

    }

    createUI(game) {
        this.scoreText = game.add.text(20, 570, '0', {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.scoreText.setScrollFactor(0);

        this.talkText = game.add.text(20, 20, '', {
            fontSize: '20px',
            fill: '#000000'
        });
        this.talkText.setScrollFactor(0);
    }

    createInput(game) {
        // Use keyboard for input.
        
        var codes = Phaser.Input.Keyboard.KeyCodes;

        this.cursors = game.input.keyboard.addKeys({
            escape: codes.ESC,
            left: codes.LEFT,
            right: codes.RIGHT,
            up: codes.UP,
            down: codes.DOWN,
            spacebar: codes.SPACEBAR
        });
    }

    fillBackground(game) {
        var graphics = game.add.graphics();
        
        graphics.fillStyle(0xccccff);

        graphics.fillRect(0, 0, 800, 600);
        
    }

    createGeometry(game) {
        // Map create
        var groundTiles = this.map.addTilesetImage('tiles');
    
        this.geometry = [];
        // create the layers
        this.backgroundLayer = this.map.createStaticLayer('Background', groundTiles, 0, 0);
        this.groundLayer = this.map.createStaticLayer('Ground', groundTiles, 0, 0);
        this.lavaLayer = this.map.createStaticLayer('Lava', groundTiles, 0, 0);
        
        var i, j;
        var slopeLeftIndexes = [32, 35, 37, 46, 69, 114];
        var slopeRightIndexes = [6, 9, 11, 33, 43, 103];

        for (i = 0; i < this.groundLayer.width; i++) {
            for (j = 0; j < this.groundLayer.height; j++) {
                // Is set
                var tile = this.groundLayer.getTileAt(i, j, true);

                if (tile && tile.index >= 0) {
                    var shape,
                        options = {isStatic: true, label: this.groundLabel};

                    if (slopeLeftIndexes.indexOf(tile.index) != -1) {
                        shape = game.matter.add.trapezoid(i * tile.width + ((5 * tile.width) / 6) + 9, (j * tile.height) + tile.height / 2 + 12, tile.width * 2 + 2, tile.height, 1, options);
                    } else if (slopeRightIndexes.indexOf(tile.index) != -1) {
                        shape = game.matter.add.trapezoid(i * tile.width - ((1 * tile.width) / 6) + 13, (j * tile.height) + tile.height / 2 + 12, tile.width * 2 + 4, tile.height, 1, options);
                    } else {
                        shape = game.matter.add.rectangle(i * tile.width + tile.width / 2, j * tile.height + tile.height / 2, tile.width, tile.height, options);   
                    }
                    this.geometry.push(shape);
                }
                
            }
        }
        for (i = 0; i < this.lavaLayer.width; i++) {
            for (j = 0; j < this.lavaLayer.height; j++) {
                // Is set
                var tile = this.lavaLayer.getTileAt(i, j, true);

                if (tile && tile.index >= 0) {
                    var shape,
                        options = {isStatic: true, label: this.lavaLabel};

                    shape = game.matter.add.rectangle(i * tile.width + tile.width / 2, j * tile.height + tile.height / 2, tile.width, tile.height/2, options);   
                    this.geometry.push(shape);
                }
                
            }
        }
        
        // prevent access outside of world.
        
        game.matter.world.setBounds(0, 0, this.groundLayer.width, this.groundLayer.height);
    }

    create(game) {
        this.fillBackground(game);
        this.score = 0;
        this.startTalkTime = 0;

        this.talkQueue = [];
        // load the map 
        this.map = game.make.tilemap({key: ('map' + this.name)});
        
        // create a player in the level
        this.player = new PlatformerPlayer('player');

        this.createGeometry(game);
        this.player.createSprite(game);

        this.player.startPhysics(game, this.groundLayer);

        // create animations for player
        this.player.createAnimations(game.anims);

        
        this.createInput(game);

        this.createCamera(game);

        this.createUI(game);
    }

    endLevel(game) {
        this.state.loadMapLevel(game, this);
    }

    update(game) {
        this.player.update(game, this.cursors);
        
        // Exit the level.
        if (this.cursors.escape.isDown || this.player.levelEnded()) {
            this.endLevel(game);
        }

        // Talk a bunch!
        var maxTalkTime = 3000;
        if ((Date.now() - this.startTalkTime) > maxTalkTime) {

            var next = this.talkQueue.shift();

            if (next) {
                this.talkText.setText(next);
                this.startTalkTime = Date.now();
            } else {
                this.startTalkTime = 0;
                this.talkText.setText('');
            }
        }
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getDescription() {
        return this.description;
    }

    unload(game) {
        this.scoreText.destroy();
        this.talkText.destroy();
        game.cameras.main.stopFollow();
        game.cameras.main.setScroll(0, 0);
        this.player.unload(game);
        this.map.removeAllLayers();

        var shape;

        while (shape = this.geometry.pop()) {
            game.matter.world.remove(shape);
        }
    }

    constructor(name, description, state, x, y) {
        super(name, state);
        this.groundLabel = 'Ground block';
        this.lavaLabel = 'Lava block';
        this.description = description;
        this.nextLevels = [];
        this.previousLevels = [];
        this.completed = false;
        this.x = x;
        this.y = y;
        this.score = 0;
    }
        
}
