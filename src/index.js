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
}

function update() {
    // Vertical stop

    var verticalSpeed = player.body.velocity.y;
    if (verticalSpeed > -0.1 && verticalSpeed < 0.1) {
        verticalSpeed = 0;
    }
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

    // Disable player rotation.
    player.setAngularVelocity(0);
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
    player = this.matter.add.sprite(400, 150, 'player');

    player.setBounce(0.2);

    //game.cameras.main.startFollow(player);

    this.matter.world.setBounds(0, -200, game.config.width, game.config.height + 200);

    keys = createInput(this);

    createAnimations(game.anims);
    /*
    this.tweens.add({
        targets: logo,
        y: 450,
        duration: 2000,
        ease: 'Power2',
        yoyo: true,
        loop: -1
    });
    */

}
