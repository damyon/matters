export default class Player {

    constructor(spriteName) {
        this.spriteName = spriteName;
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

    getSprite() {
        
    }

    update(game, input) {
        throw new TypeError("Abstract!");
    }

    unload(game) {
        
    }
}