import 'phaser';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: "matter"
    },
};

var game = new Phaser.Game(config);
var keys = null;
var player = null;

function preload ()
{
    this.load.atlas('player', 'assets/sprites/player/sheet.png', 'assets/sprites/player/sprites.json');
    this.load.tilemapTiledJSON('map1', 'assets/maps/level1/map.json');
    this.load.spritesheet('tiles', 'assets/maps/tiles.png', {frameWidth: 72, frameHeight: 72});
}

function update() {
    // Disable player rotation.
    player.setAngularVelocity(0);
    
    // Vertical stop - need a better way to determine standing.

    var verticalSpeed = player.body.velocity.y;
    if (verticalSpeed > -2.5 && verticalSpeed < 2.5) {
        verticalSpeed = 0;
    }
    console.log("vertical speed" + verticalSpeed);
    if (keys.up.isDown && verticalSpeed == 0) {
        player.setVelocityY(-10);
        player.anims.play('jump', true); // play jump animation
    } else if (keys.left.isDown) {
        player.setVelocityX(-3); // move left
        player.anims.play('walk', true); // play walk animation
        player.flipX = true; // flip the sprite to the left
    } else if (keys.right.isDown) {
        player.setVelocityX(3); // move right
        player.anims.play('walk', true); // play walk animation
        player.flipX = false; // flip the sprite to the left
    } else {
        player.setVelocityX(0); // move right
        if (verticalSpeed == 0) {
            player.anims.play('idle', true); // play idle animation
        }
    }

    
}

function createInput(game) {
    // Use keyboard for input.
    var codes = Phaser.Input.Keyboard.KeyCodes;

    return game.input.keyboard.addKeys({
        escape: codes.ESC,
        left: codes.LEFT,
        right: codes.RIGHT,
        up: codes.UP,
        down: codes.DOWN,
        spacebar: codes.SPACEBAR
    });
}

function createAnimations(animations) {
    // player walk animation
    if (!animations.anims.has('walk')) {
        animations.create({
            key: 'walk',
            frames: animations.generateFrameNames('player', {prefix: 'walk', start: 1, end: 8, zeroPad: 1}),
            frameRate: 10,
            repeat: -1
       });
    }
    // idle
    if (!animations.anims.has('idle')) {
        animations.create({
            key: 'idle',
            frames: animations.generateFrameNames('player', {prefix: 'idle', start: 1, end: 3, zeroPad: 1}),
            frameRate: 0.5,
            repeat: -1
        });
    }
    // jump with only one frame, so repeat is not neaded
    if (!animations.anims.has('jump')) {
        animations.create({
            key: 'jump',
            frames: [{key: 'player', frame: 'jump1'}],
            frameRate: 1,

        });
    }
}



function create ()
{
    player = this.matter.add.sprite(400, 150, 'player', null, {
        shape: { type: 'rectangle', x: 0, y: 0, width:30, height:50 }});
 
    player.setBounce(0.2);

    this.matter.world.createDebugGraphic();
    
    keys = createInput(this);

    createAnimations(game.anims);

    this.map = this.make.tilemap({key: 'map1'});

    var groundTiles = this.map.addTilesetImage('tiles');
       
    // create the ground layer
   // this.groundLayer = this.map.createDynamicLayer('Ground', groundTiles, 0, 0);
    this.groundLayer = this.map.createStaticLayer('Ground', groundTiles, 0, 0);
   
    this.matter.world.convertTilemapLayer(this.groundLayer);
    var i, j;
    var slopeLeftIndexes = [32, 35, 37, 46, 69, 114];
    var slopeRightIndexes = [6, 9, 11, 33, 43, 103];

    for (i = 0; i < this.groundLayer.width; i++) {
        for (j = 0; j < this.groundLayer.height; j++) {
            // Is set
            var tile = this.groundLayer.getTileAt(i, j, true);

            if (tile && tile.index >= 0) {
                if (slopeLeftIndexes.indexOf(tile.index) != -1) {
                    this.matter.add.trapezoid(i * tile.width + ((5 * tile.width) / 6) + 10, (j * tile.height) + tile.height / 2 + 12, tile.width * 2 + 2, tile.height, 1, {isStatic: true});
                } else if (slopeRightIndexes.indexOf(tile.index) != -1) {
                    this.matter.add.trapezoid(i * tile.width - ((1 * tile.width) / 6) + 13, (j * tile.height) + tile.height / 2 + 12, tile.width * 2 + 4, tile.height, 1, {isStatic: true});
                } else {
                    this.matter.add.rectangle(i * tile.width + tile.width / 2, j * tile.height + tile.height / 2, tile.width, tile.height, { isStatic: true });   
                }
            }
            
        }
    }
    
    // enable collisions on the ground layer.
    
    
    this.matter.world.setBounds(0, 0, this.groundLayer.width, this.groundLayer.height);
    this.cameras.main.setBackgroundColor(0xccccff);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, this.groundLayer.width, this.groundLayer.height);
    // make the camera follow the player
    this.cameras.main.startFollow(player);



    // the player will collide with this layer
}
