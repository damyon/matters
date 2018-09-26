import MapLevel from './maplevel.js'; 
import PlatformerLevel from './platformerlevel.js'; 
import WelcomeLevel from './welcomelevel.js'; 
import BeachLevel from './beachlevel.js'; 
import Trophy from './trophy.js';

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

        // Load all current trophies
        let i = 0;
        for (i = 0; i < this.trophiesCollected.length; i++) {
            this.trophiesCollected[i].create(game);
        }
    }

    getPlatformerLevels() {
        return this.platformerLevels;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    preload(game) {
        let i = 0;

        if (!this.currentLevel.isPreloaded()) {
            this.currentLevel.preload(game);
            this.currentLevel.setIsPreloaded(true);
        }

        for (i = 0; i < this.platformerLevels.length; i++) {
            let level = this.platformerLevels[i];
            if (!level.isPreloaded()) {
                level.preload(game);
                level.setIsPreloaded(true);
            }
        }

        let trophy = new Trophy("door", 50, 50);
        trophy.preload(game);
        trophy.setIsPreloaded(true);
        this.allTrophies.push(trophy);
    }

    update(game) {
    }


    collectTrophy(name, game) {
        let i, match = null;

        for (i = 0; i < this.trophiesCollected.length; i++) {
            if (this.trophiesCollected[i].name == name) {
                match = this.trophiesCollected[i];
            }
        }
        if (match == null) {
            for (i = 0; i < this.allTrophies.length; i++) {
                if (this.allTrophies[i].name == name) {
                    match = this.allTrophies[i];
                }
            }
            if (match) {
                match.create(game);
                this.trophiesCollected.push(match);
            }
        }
    }

    create(game) {
        this.currentLevel.create(game);

        // World create
        //game.matter.world.createDebugGraphic();
    }

    constructor() {
        this.trophiesCollected = [];
        this.allTrophies = [];
        this.createLevels();

    }
}
