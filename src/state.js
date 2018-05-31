import MapLevel from './maplevel.js'; 
import PlatformerLevel from './platformerlevel.js'; 
import WelcomeLevel from './welcomelevel.js'; 
import BeachLevel from './beachlevel.js'; 

export default class State {

    createLevels() {
        this.mapLevel = new MapLevel('map', this);

        this.platformerLevels = [];
        this.platformerLevels[0] = new WelcomeLevel('welcome', "Welcome to my awesome island!", this, 80, 330);

        this.platformerLevels[1] = new BeachLevel('beach', "Welcome to the beach.\nThese rocks would make a\ngreat floor for my house.", this, 180, 300);
        this.platformerLevels[0].addNextLevel(this.platformerLevels[1]);

        this.currentLevel = this.mapLevel;
    }

    loadMapLevel(game, lastLevel) {
        this.loadLevel(this.mapLevel, game);
        this.currentLevel.setSelectedLevel(lastLevel, game);
    }

    loadLevel(levelToLoad, game) {
        this.currentLevel.unload(game);

        this.currentLevel = levelToLoad;
        
        this.currentLevel.create(game);
    }

    getPlatformerLevels() {
        return this.platformerLevels;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    preload(game) {
        var i = 0;

        if (!this.currentLevel.isPreloaded()) {
            this.currentLevel.preload(game);
            this.currentLevel.setIsPreloaded(true);
        }

        for (i = 0; i < this.platformerLevels.length; i++) {
            var level = this.platformerLevels[i];
            if (!level.isPreloaded()) {
                level.preload(game);
                level.setIsPreloaded(true);
            }
        }
        
    }

    create(game) {
        this.currentLevel.create(game);

        // World create
        //game.matter.world.createDebugGraphic();
    }

    constructor() {
        this.createLevels();

    }
}
