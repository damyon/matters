import Player from './player.js'; 

export default class PlatformerPlayer extends Player {

    createSprite(game) {
        var options = {
            shape: { type: 'rectangle', x: 0, y: 0, width:30, height:50 },
            label: 'Platformer Player'
        };
        this.sprite = game.matter.add.sprite(300, 200, this.spriteName, null, options);
        this.sprite.setBounce(0.2); 

        //game.matter.world.on('collisionstart', this.collided, this);
        game.matter.world.on('collisionactive', this.collided, this);
        return this.sprite;
    }

    isStanding() {
        var diffX = Math.abs(this.sprite.x - this.lastStanding.x),
            diffY = Math.abs(this.sprite.y - this.lastStanding.y);

        var diff = diffX + diffY;

        return diff < this.jumpFlex;
    }

    collided(event, bodyA, bodyB) {
        var player = null,
            ground = null;

        if (bodyA.label == 'Platformer Player') {
            player = bodyA;
        }
        if (bodyB.label == 'Platformer Player') {
            player = bodyB;
        }
        if (bodyA.label == 'Ground block') {
            ground = bodyA;
        }
        if (bodyB.label == 'Ground block') {
            ground = bodyB;
        }
        
        if (player != null && ground != null) {
            console.log(player.position, ground.position);
            
            if (player.position.y < (ground.position.y) && (ground.bounds.min.x <= player.position.x <= ground.bounds.max.x)) {
                // Valid ground contact.
                this.lastStanding = { x: player.position.x, y: player.position.y };
            }
        }
    }

    startPhysics(game, groundLayer) {
       this.lastStanding = { x: 0, y: 0};
       this.jumpFlex = 25;
    }

    getSprite() {
        return this.sprite;
    }

    update(game, input) {
        this.sprite.setAngularVelocity(0);
        // Input update
        
        var standing = this.isStanding();
        if (input.up.isDown && standing) {
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
            if (standing == 0) {
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
