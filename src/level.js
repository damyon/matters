export default class Level {

    preload(game) {

    }

    create(game) {

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

    constructor(name, state) {
        this.preloaded = false;
        this.name = name;
        this.state = state;
    }

}
