import Level from './level.js'; 
import PlatformerPlayer from './platformerplayer.js';

export default class PlatformerLevel extends Level {
    preload(game) {

        // map made with Tiled in JSON format
        game.load.tilemapTiledJSON('map' + this.name, this.levelFile);
        // tiles in spritesheet 
        game.load.spritesheet('tiles', 'assets/maps/tiles.png', {frameWidth: 72, frameHeight: 72});
        // simple coin image
        //game.load.image('coin', 'assets/sprites/coin/coin.png');
        // slopes
        //game.load.image('slopeup', 'assets/sprites/slope/slopeup.png');

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

    collectCoin(sprite, tile) {
        this.coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
        this.score++; // increment the score
        this.scoreText.setText(this.score); // set the text to show the current score
        return false;
    }

    collideSlope(sprite, tile) {
        //this.slopeLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin

        // Tile bounds are from
        // tile.pixelX -> tile.pixelX + tile.width
        // tile.pixelY -> tile.pixelY + tile.height

        // Sprite bounds are from
        // sprite.x -> sprite.x + sprite.width
        // sprite.y -> sprite.y + sprite.height

        // What we want to check is if either foot is below the diagonal line
        // Lets just check one point between the feet.
        var footX = sprite.x + sprite.width / 2;
        var footY = sprite.y + sprite.height / 8 - 5;

        var delta = (footX - tile.pixelX) / tile.width;
        var tileY = (tile.pixelY + tile.height) - (delta * tile.height);

        //if (delta >= -2 && delta <= 2 && footY > tileY) {
        if (footY > tileY || delta >= 1) {
            // Collision!
            //sprite.y -= 25;
            //debugger;
            // amount depends on the size of collision
            var recover = footY - tileY;
            // Max diff is 10.
            if (recover > 10) {
                recover = 10;
            }
            // Min diff is 5.
            if (recover < 5) {
                recover = 5;
            }
            // Scale back to 1.
            recover *= 0.1;

            // Now scale to max recovery size.
            recover *= 25;
            sprite.scene.physics.moveTo(sprite, sprite.x, sprite.y - recover, null, 100);

            return true;
        }
        
        return false;

        
        
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
        //this.cursors = game.input.keyboard.createCursorKeys();
        
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
        // create the ground layer
        this.groundLayer = this.map.createStaticLayer('Ground', groundTiles, 0, 0);
    
        var i, j;
        var slopeLeftIndexes = [32, 35, 37, 46, 69, 114];
        var slopeRightIndexes = [6, 9, 11, 33, 43, 103];

        for (i = 0; i < this.groundLayer.width; i++) {
            for (j = 0; j < this.groundLayer.height; j++) {
                // Is set
                var tile = this.groundLayer.getTileAt(i, j, true);

                if (tile && tile.index >= 0) {
                    var shape;

                    if (slopeLeftIndexes.indexOf(tile.index) != -1) {
                        shape = game.matter.add.trapezoid(i * tile.width + ((5 * tile.width) / 6) + 9, (j * tile.height) + tile.height / 2 + 12, tile.width * 2 + 2, tile.height, 1, {isStatic: true});
                    } else if (slopeRightIndexes.indexOf(tile.index) != -1) {
                        shape = game.matter.add.trapezoid(i * tile.width - ((1 * tile.width) / 6) + 13, (j * tile.height) + tile.height / 2 + 12, tile.width * 2 + 4, tile.height, 1, {isStatic: true});
                    } else {
                        shape = game.matter.add.rectangle(i * tile.width + tile.width / 2, j * tile.height + tile.height / 2, tile.width, tile.height, { isStatic: true });   
                    }
                    this.geometry.push(shape);
                }
                
            }
        }
        
        // enable collisions on the ground layer.
        
        game.matter.world.setBounds(0, 0, this.groundLayer.width, this.groundLayer.height);
    }

    create(game) {
        this.fillBackground(game);
        this.score = 0;
        this.startTalkTime = 0;

        this.talkQueue = [];
        // load the map 
        this.map = game.make.tilemap({key: ('map' + this.name)});
        
        // tiles for the ground layer
      //  var groundTiles = this.map.addTilesetImage('tiles');
        // Add some water.
       // this.waterLayer = this.map.createDynamicLayer('Water', groundTiles, 0, 0);
        
        // create the ground layer
      //  this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0);

        /*
        var slopeTiles = this.map.addTilesetImage('slopeup');
       
        // slopes are special.
        this.slopeLayer = this.map.createDynamicLayer('Slope', slopeTiles, 0, 0);

        // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);
 
        // coin image used as tileset
        var coinTiles = this.map.addTilesetImage('coin');
        // add coins as tiles
        this.coinLayer = this.map.createDynamicLayer('Coins', coinTiles, 0, 0);
        // set the boundaries of our game world

        game.physics.world.bounds.width = this.groundLayer.width;
        game.physics.world.bounds.height = this.groundLayer.height;
        */        

        // create a player in the level
        this.player = new PlatformerPlayer('player');

        this.player.createSprite(game);

        this.player.startPhysics(game, this.groundLayer);

        /*
        // find the index of the slope image.
        var j = 0, slopeTileIndex = -1;
        for (j = 0; j < 1000; j++) {
            if (this.slopeLayer.tileset.containsTileIndex(j)) {
                // found it!
                slopeTileIndex = j;
                break;
            }
        } 
       
        this.slopeLayer.setTileIndexCallback(slopeTileIndex, this.collideSlope, this);

        // when the player overlaps with a tile with index 17, collectCoin 
        // will be called    
        this.slopeCollider = game.physics.add.overlap(this.player.getSprite(), this.slopeLayer);
       
        // find the index of the coin image.
        var i = 0, coinTileIndex = -1;
        for (i = 0; i < 1000; i++) {
            if (this.coinLayer.tileset.containsTileIndex(i)) {
                // found it!
                coinTileIndex = i;
                break;
            }
        } 

        this.coinLayer.setTileIndexCallback(coinTileIndex, this.collectCoin, this);

        // when the player overlaps with a tile with index 17, collectCoin 
        // will be called    
        this.coinCollider = game.physics.add.overlap(this.player.getSprite(), this.coinLayer);
        
        */
        // create animations for player
        this.player.createAnimations(game.anims);

        this.createGeometry(game);

        this.createInput(game);

        this.createCamera(game);

        this.createUI(game);
    }

    update(game) {
        var playerSprite = this.player.getSprite();

        this.player.update(game, this.cursors);
        playerSprite.setAngularVelocity(0);
        //playerSprite.enableBody();
        // Player movement.
        /*
        if (this.cursors.up.isDown && (playerSprite.body.onFloor() || playerSprite.body.touching.isDown)) {
        
            playerSprite.body.setVelocityY(-400);
            playerSprite.anims.play('jump', true); // play walk animation
            
        } else if (this.cursors.left.isDown)
        {
            playerSprite.body.setVelocityX(-200); // move left
            playerSprite.anims.play('walk', true); // play walk animation
            playerSprite.flipX = true; // flip the sprite to the left
        }
        else if (this.cursors.right.isDown)
        {
            playerSprite.body.setVelocityX(200); // move right
            playerSprite.anims.play('walk', true); // play walk animatio
            playerSprite.flipX = false; // use the original sprite looking to the right
        } else {
            playerSprite.body.setVelocityX(0);
            if (playerSprite.body.onFloor()) {
                playerSprite.anims.play('idle', true);
            }
        }  
*/
        // Exit the level.
        if (this.cursors.escape.isDown) {
            this.state.loadMapLevel(game, this);
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
        //this.map.destroy();
        this.scoreText.destroy();
        this.talkText.destroy();
        //debugger;
        game.cameras.main.stopFollow();
        game.cameras.main.setScroll(0, 0);
        this.player.unload(game);
       // this.coinCollider.destroy();
        this.map.removeAllLayers();

        var shape;

        while (shape = this.geometry.pop()) {
            game.matter.world.remove(shape);
        }
        //game.matter.removeAllLayers();
        //game.physics.destroy();
        //this.groundLayer.destroy();

        //this.coinLayer.destroy();


    }

    constructor(name, description, state, x, y) {
        super(name, state);

        this.description = description;
        this.nextLevels = [];
        this.previousLevels = [];
        this.completed = false;
        this.x = x;
        this.y = y;
        this.score = 0;
    }
        
}
