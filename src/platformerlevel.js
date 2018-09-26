import Level from './level.js'; 
import PlatformerPlayer from './platformerplayer.js';

export default class PlatformerLevel extends Level {
    preload(game) {

        // map made with Tiled in JSON format
        game.load.tilemapTiledJSON('map' + this.name, this.levelFile);
        // tiles in spritesheet 
        game.load.spritesheet('tiles', 'assets/maps/tiles.png', {frameWidth: 70, frameHeight: 70, spacing: 2, margin: 0});
        game.load.spritesheet('rewards', 'assets/sprites/star/star.png', {frameWidth: 72, frameHeight: 72});
      
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
        this.scoreText = game.add.text(680, 40, '0', {
            fontSize: '30px',
            fill: '#ffffff',
            align: 'left'
        });
        this.scoreText.setScrollFactor(0);

        this.scoreText.setShadow(1, 0, 'rgba(0,0,0,1.0)', 5);
        //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
        this.scoreText.setOrigin(0.5);
        

        this.talkText = game.add.text(200, 200, '', {
            fontSize: '30px',
            fill: '#ffffff',
            align: 'left'
        });
        this.talkText.setShadow(1, 0, 'rgba(0,0,0,1.0)', 5);
        
        this.talkText.setScrollFactor(0);
    }

    updateScoreText() {
        let s = this.player.getScoreText();
        this.scoreText.setText(s);
    }

    createInput(game) {
        // Use keyboard for input.
        
        let codes = Phaser.Input.Keyboard.KeyCodes;

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
        let graphics = game.add.graphics();
        
        graphics.fillStyle(0xccccff);

        graphics.fillRect(0, 0, 800, 600);
        
    }

    createBlocks(layer, options, game) {
        let i, j;
        let slopeLeftIndexes = [32, 35, 37, 46, 69, 114];
        let slopeRightIndexes = [6, 9, 11, 33, 43, 103];

        for (i = 0; i < layer.width; i++) {
            for (j = 0; j < layer.height; j++) {
                // Is set
                let tile = layer.getTileAt(i, j, true);

                if (tile && tile.index >= 0) {
                    let shape;
                    // Pass a reference to the tile and layer.
                    options.tile = tile;
                    options.layer = layer;
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
    }

    createGeometry(game) {
        // Map create
        let groundTiles = this.map.addTilesetImage('tiles');
        let rewardTiles = this.map.addTilesetImage('rewards');
    
        this.geometry = [];
        // create the layers
        this.backgroundLayer = this.map.createStaticLayer('Background', groundTiles, 0, 0);
        this.groundLayer = this.map.createStaticLayer('Ground', groundTiles, 0, 0);
        this.lavaLayer = this.map.createStaticLayer('Lava', groundTiles, 0, 0);
        this.platformLayer = this.map.createStaticLayer('Platforms', groundTiles, 0, 0);
        this.rewardLayer = this.map.createDynamicLayer('Rewards', rewardTiles, 0, 0)
        
        let groundOptions = {isStatic: true, label: this.groundLabel};
        this.createBlocks(this.groundLayer, groundOptions, game);

        let lavaOptions = {isStatic: true, label: this.lavaLabel};
        this.createBlocks(this.lavaLayer, lavaOptions, game);

        let platformOptions = {isStatic: true, label: this.platformLabel};
        this.createBlocks(this.platformLayer, platformOptions, game);

        let rewardOptions = {isStatic: true, label: this.rewardLabel};
        this.createBlocks(this.rewardLayer, rewardOptions, game);

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
        this.player.on('scoreUpdated', this.updateScoreText.bind(this));
       
        this.player.startPhysics(game, this.groundLayer);

        // create animations for player
        this.player.createAnimations(game.anims);

        
        this.createInput(game);

        this.createCamera(game);

        this.createUI(game);
        this.updateScoreText();
    }

    endLevel(game) {
        this.state.loadMapLevel(game, this);
    }

    waitForTalking() {
        let done = new Promise(function(resolve, reject) {
            let checkIt = function() {
                if (!this.isTalking()) {
                    resolve(true);
                } else {
                    setTimeout(checkIt, 250);
                }
            }.bind(this);
            
            setTimeout(checkIt, 50);
        }.bind(this));
        return done;
    }

    isTalking() {
        return this.talkQueue.length > 0 || (this.talkText.text != '');
    }

    update(game) {
        this.player.update(game, this.cursors);
        
        // Exit the level.
        if (this.cursors.escape.isDown || this.player.levelEnded()) {
            this.endLevel(game);
        }

        // Talk a bunch!
        let maxTalkTime = 3000;
        if ((Date.now() - this.startTalkTime) > maxTalkTime) {

            let next = this.talkQueue.shift();

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

        let shape;

        while (shape = this.geometry.pop()) {
            game.matter.world.remove(shape);
        }
    }

    constructor(name, description, state, x, y) {
        super(name, state);
        this.groundLabel = 'Ground block';
        this.lavaLabel = 'Lava block';
        this.platformLabel = 'Platform block';
        this.rewardLabel = 'Reward block';
        this.description = description;
        this.nextLevels = [];
        this.previousLevels = [];
        this.completed = false;
        this.x = x;
        this.y = y;
        this.score = 0;
    }
        
}
