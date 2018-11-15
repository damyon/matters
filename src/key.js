export default class Key {

    preload(game) {
        let filename = 'assets/controls/' + this.name + '.png';
        game.load.image(this.spriteName, filename);
    }

    create(game) {
        this.sprite = game.add.image(this.originX, this.originY, this.spriteName);
        this.sprite.name = this.spriteName;
        this.sprite.setInteractive();
        this.sprite.setScrollFactor(0);
    }

    update(game) {
        this.sprite.unload(game);
    }

    unload(game) {
        
    }

    isPreloaded() {
        return this.preloaded;
    }

    setIsPreloaded(value) {
        this.preloaded = value;
    }

    constructor(name, originX, originY) {
        this.preloaded = false;
        this.name = name;
        this.spriteName = 'control' + this.name;
        this.originX = originX;
        this.originY = originY;
        this.sprite = null;
    }

}
