import Player from './player.js'; 

export default class PlatformerPlayer extends Player {

    createSprite(game) {
        var shape = {
            shape: { type: 'rectangle', x: 0, y: 0, width:30, height:50 }
        };
        this.sprite = game.matter.add.sprite(300, 200, this.spriteName, null, shape);
        this.sprite.setBounce(0.2); 

        return this.sprite;
    }

    startPhysics(game, groundLayer) {
       
    }

    getSprite() {
        return this.sprite;
    }

    update(game, input) {
        this.sprite.setAngularVelocity(0);
        // Input update
        // Vertical stop - need a better way to determine standing.
        var verticalSpeed = this.sprite.body.velocity.y;
        if (verticalSpeed > -2.5 && verticalSpeed < 2.5) {
            verticalSpeed = 0;
        }
        if (input.up.isDown && verticalSpeed == 0) {
            this.sprite.setVelocityY(-10);
            this.sprite.anims.play('jump', true); // play jump animation
        } else if (input.left.isDown) {
            this.sprite.setVelocityX(-3); // move left
            this.sprite.anims.play('walk', true); // play walk animation
            this.sprite.flipX = true; // flip the sprite to the left
        } else if (input.right.isDown) {
            this.sprite.setVelocityX(3); // move right
            this.sprite.anims.play('walk', true); // play walk animation
            this.sprite.flipX = false; // flip the sprite to the left
        } else {
            this.sprite.setVelocityX(0); // move right
            if (verticalSpeed == 0) {
                this.sprite.anims.play('idle', true); // play idle animation
            }
        }
    }

    createAnimations(animations) {
        // player walk animation
        if (!animations.anims.has('walk')) {
            animations.create({
                key: 'walk',
                frames: animations.generateFrameNames('player', {prefix: 'walk', start: 1, end: 8, zeroPad: 1}),
                frameRate: 10,
                repeat: -1
           });
        }
        // idle with only three frames, so repeat is not neaded
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

    unload(game) {
        game.matter.world.remove(this.sprite);
        this.sprite.setVisible(false);
    }
}
