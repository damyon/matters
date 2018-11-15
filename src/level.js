export default class Level {

    preload(game) {

    }

    create(game) {
        game.input.on('pointerdown', this.fakeKeyboard.bind(this));
        game.input.on('pointerup', this.noKeyboard.bind(this));
    }

    fakeKeyboard(pointer, image) {
        if (image.length < 1) {
            return;
        }
        if (image[0].name == "controlright") {
            this.rightDown = true;
        }
        if (image[0].name == "controlleft") {
            this.leftDown = true;
        }
        if (image[0].name == "controlup") {
            this.upDown = true;
        }
        if (image[0].name == "controlenter") {
            this.enterDown = true;
        }
        if (image[0].name == "controlcancel") {
            this.cancelDown = true;
        }
    }

    noKeyboard() {
        this.rightDown = false;
        this.leftDown = false;
        this.upDown = false;
        this.enterDown = false;
        this.cancelDown = false;
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
        this.rightDown = false;
        this.leftDown = false;
        this.upDown = false;
        this.enterDown = false;
        this.cancelDown = false;
    }

}
