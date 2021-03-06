import MapLevel from './maplevel.js'; 
import PlatformerLevel from './platformerlevel.js'; 
import WelcomeLevel from './welcomelevel.js'; 
import BeachLevel from './beachlevel.js'; 
import ForestLevel from './forestlevel.js'; 
import MountainLevel from './mountainlevel.js'; 
import VillageLevel from './villagelevel.js'; 
import Trophy from './trophy.js';
import Key from './key.js';

export default class State {

    createLevels() {
        this.mapLevel = new MapLevel('map', this);

        this.platformerLevels = [];
        this.platformerLevels[0] = new WelcomeLevel('welcome', "Welcome to my awesome island!", this, 80, 330);

        this.platformerLevels[1] = new BeachLevel('beach', "Welcome to the beach. \nThe sun is warm and good.", this, 180, 300);
        this.platformerLevels[2] = new ForestLevel('forest', "Welcome to the forest. \nThe forest is cool and shady", this, 260, 300);
        this.platformerLevels[3] = new MountainLevel('mountain', "Welcome to the mountain. \nRocks, rocks rocks.", this, 380, 240);
        this.platformerLevels[4] = new VillageLevel('village', "Welcome to the village. \nI want a house here.", this, 460, 320);
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
        this.currentLevel.unload(game);

        this.currentLevel = levelToLoad;
        
        this.currentLevel.create(game);

        // Load all current trophies
        let i = 0;
        for (i = 0; i < this.trophiesCollected.length; i++) {
            this.trophiesCollected[i].create(game);
        }

        for (i = 0; i < this.allKeys.length; i++) {
            this.allKeys[i].create(game);
        }

    }

    getPlatformerLevels() {
        return this.platformerLevels;
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    preloadKey(game, name, x, y) {
        let key = new Key(name, x, y);
        key.preload(game);
        key.setIsPreloaded(true);
        this.allKeys.push(key);
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

        this.preloadTrophy(game, "walls", 50, 30);
        this.preloadTrophy(game, "window", 100, 30);
        this.preloadTrophy(game, "roof", 150, 30);
        this.preloadTrophy(game, "door", 200, 30);

        this.preloadKey(game, "left", 620, 560);
        this.preloadKey(game, "up", 680, 510);
        this.preloadKey(game, "right", 740, 560);
        this.preloadKey(game, "enter", 40, 560);
        this.preloadKey(game, "cancel", 40, 40);
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

    countTrophies() {
        return this.trophiesCollected.length;
    }

    create(game) {
        this.currentLevel.create(game);

        
        let i = 0;
        for (i = 0; i < this.allKeys.length; i++) {
            this.allKeys[i].create(game);
        }


        // World create
        // game.matter.world.createDebugGraphic();
    }

    constructor() {
        this.trophiesCollected = [];
        this.allTrophies = [];
        this.allKeys = [];
        this.createLevels();

    }
}
