import MapLevel from './maplevel.js'; 
import PlatformerLevel from './platformerlevel.js'; 
import WelcomeLevel from './welcomelevel.js'; 
import BeachLevel from './beachlevel.js'; 
import ForestLevel from './forestlevel.js'; 
import Trophy from './trophy.js';

export default class State {

    createLevels() {
        this.mapLevel = new MapLevel('map', this);

        this.platformerLevels = [];
        this.platformerLevels[0] = new WelcomeLevel('welcome', "Welcome to my awesome island!", this, 80, 330);

        this.platformerLevels[1] = new BeachLevel('beach', "Welcome to the beach. \nThe sun is warm and good.", this, 180, 300);
        this.platformerLevels[2] = new ForestLevel('forest', "Welcome to the forest. \nThe forest is cool and shady", this, 260, 300);
        this.platformerLevels[3] = new ForestLevel('mountain', "Welcome to the mountain. \nRocks, rocks rocks.", this, 380, 240);
        this.platformerLevels[4] = new ForestLevel('village', "Welcome to the village. \nI want a house here.", this, 460, 320);
        this.platformerLevels[0].addNextLevel(this.platformerLevels[1]);
        this.platformerLevels[1].addNextLevel(this.platformerLevels[2]);
        this.platformerLevels[2].addNextLevel(this.platformerLevels[3]);
        this.platformerLevels[3].addNextLevel(this.platformerLevels[4]);

        this.currentLevel = this.mapLevel;
    }

    loadMapLevel(game, lastLevel) {
        this.loadLevel(this.mapLevel, game);
        this.currentLevel.setSelectedLevel(lastLevel, game);
    }

    loadLevel(levelToLoad, game) {
        console.log(levelToLoad);
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

    preloadTrophy(game, name, x, y) {
        let trophy = new Trophy(name, x, y);
        trophy.preload(game);
        trophy.setIsPreloaded(true);
        this.allTrophies.push(trophy);
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

        this.preloadTrophy(game, "door", 50, 30);
        this.preloadTrophy(game, "window", 100, 30);
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
