export default class Player {

    constructor(spriteName) {
        this.spriteName = spriteName;
        this.endLevel = false;
    }

    createSprite(game) {
        throw new TypeError("Abstract!");
    }

    startPhysics(game, groundLayer) {
        throw new TypeError("Abstract!");
    }

    createAnimations(animations) {
        throw new TypeError("Abstract!");
    }

    levelEnded() {
        return this.endLevel;
    }

    getSprite() {
        
    }

    update(game, input, level) {
        throw new TypeError("Abstract!");
    }

    unload(game) {
        
    }
}
