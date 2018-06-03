import Player from './player.js'; 

export default class PlatformerPlayer extends Player {

    createSprite(game) {
        var options = {
            shape: { type: 'rectangle', x: 0, y: 0, width:30, height:50 },
            label: 'Platformer Player'
        };
        this.playerSpriteOffset = 55;
        this.sprite = game.matter.add.sprite(300, 1000, this.spriteName, null, options);
        this.sprite.setBounce(0.2); 

        game.matter.world.on('collisionstart', this.collisionStart, this);
        game.matter.world.on('collisionactive', this.collisionActive, this);
        return this.sprite;
    }

    isStanding() {
        var diffX = Math.abs(this.sprite.x - this.lastStanding.x),
            diffY = Math.abs(this.sprite.y - this.lastStanding.y);

        var diff = diffX + diffY;

        return diff < this.jumpFlex;
    }

    collisionStart(event, bodyA, bodyB) {
        var player = null, platform = null;

        if (bodyA.label == 'Platform block') {
            platform = bodyA;
        }
        if (bodyB.label == 'Platform block') {
            platform = bodyB;
        }
        if (bodyA.label == 'Platformer Player') {
            player = bodyA;
        }
        if (bodyB.label == 'Platformer Player') {
            player = bodyB;
        }
        
        if (platform != null && player != null) {
            // Is the player moving up or down ?
            if ((player.velocity.y <= 0) || (player.position.y > platform.position.y - this.playerSpriteOffset)) {
                // Cancel this collision - only disallow on the way down.
                var i = 0;
                for (i = 0; i < event.pairs.length; i++) {
                    event.pairs[i].isActive = false;
                }
            }
        }
    }

    collisionActive(event, bodyA, bodyB) {
        var player = null,
            ground = null,
            world = null,
            lava = null,
            platform = null;

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

        if (bodyA.label == 'Platform block') {
            if (player.position.y < bodyA.position.y - this.playerSpriteOffset) {
                ground = bodyA;
            }
        }
        if (bodyB.label == 'Platform block') {
            if (player.position.y < bodyB.position.y - this.playerSpriteOffset) {
                ground = bodyB;
            }
        }


        if (bodyA.label == 'Lava block') {
            lava = bodyA;
        }
        if (bodyB.label == 'Lava block') {
            lava = bodyB;
        }
        
        if (bodyA.mass == Infinity && ground == null) {
            world = bodyA;
        }
        if (bodyB.mass == Infinity && ground == null) {
            world = bodyB;
        }

        if (lava != null) {
            this.endLevel = true;
        }
        if (player != null && ground != null) {
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
            this.sprite.setVelocityX(0);
            if (standing) {
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
