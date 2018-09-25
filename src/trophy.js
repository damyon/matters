export default class Trophy {

    preload(game) {
        let filename = 'assets/trophies/' + this.name + '.png';
        console.log('preload image: ' + filename);
        game.load.image(this.spriteName, filename);
    }

    create(game) {
        console.log('add image: ' + this.spriteName + ' ' + this.originX + ' ' + this.originY);
        this.sprite = game.add.image(this.originX, this.originY, this.spriteName);
        this.sprite.setScrollFactor(0);
    }

    update(game) {
        
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
        this.spriteName = 'trophy' + this.name;
        this.originX = originX;
        this.originY = originY;
        this.sprite = null;
    }

}
