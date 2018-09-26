import Player from './player.js'; 

export default class Sprite extends Player {


    setPosition(x, y) {
        this.originX = x;
        this.originY = y;
    }

    createSprite(game) {
        let options = {
            label: this.spriteName + ' Label',
            isStatic: true
        };
        this.sprite = game.matter.add.sprite(this.originX, this.originY, this.spriteName, null, options);
    }

    handlePlayerContact(method) {
        this.playerContactMethod = method;
        this.sprite.playerContactMethod = this.playerContactMethod;
    }

    createAnimations(animations) {
        // player walk animation
        if (!animations.anims.has(this.spriteName + 'walk')) {
            animations.create({
                key: this.spriteName + 'walk',
                frames: animations.generateFrameNames(this.spriteName, {prefix: 'walk', start: 1, end: 8, zeroPad: 1}),
                frameRate: 10,
                repeat: -1
           });
        }
        // idle with only three frames, so repeat is not neaded
        if (!animations.anims.has(this.spriteName + 'idle')) {
            animations.create({
                key: this.spriteName + 'idle',
                frames: animations.generateFrameNames(this.spriteName, {prefix: 'idle', start: 1, end: 3, zeroPad: 1}),
                frameRate: 0.5,
                repeat: -1
            });
        }
        // jump with only one frame, so repeat is not neaded
        if (!animations.anims.has(this.spriteName + 'jump')) {
            animations.create({
                key: this.spriteName + 'jump',
                frames: [{key: this.spriteName, frame: 'jump1'}],
                frameRate: 1,
            });
        }

        this.sprite.anims.play(this.spriteName + 'idle', true); // play idle animation
    }

    unload(game) {
        game.matter.world.remove(this.sprite);
        this.sprite.setVisible(false);
    }

    constructor(spriteName) {
        super(spriteName);
        this.playerContactMethod = false;
    }
}
