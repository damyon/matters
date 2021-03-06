import Level from './level.js'; 

export default class MapLevel extends Level {
    preload(game) {
        game.load.image('mainmap', 'assets/mainmenu/menu.png');
        game.load.image('mapplayer', 'assets/mainmenu/mapplayer.png');
    }

    getTime() {
        let d = new Date();
        return d.getTime();
    }

    createInput(game) {
        let codes = Phaser.Input.Keyboard.KeyCodes;
        this.lastInput = this.getTime();

        this.keys = game.input.keyboard.addKeys({
            left: codes.LEFT,
            right: codes.RIGHT,
            down: codes.DOWN,
            up: codes.UP,
            enter: codes.ENTER
        });

 //       game.input.on('pointerdown', this.fakeKeyboard.bind(this));
    }

    notfakeKeyboard(pointer, image) {
        if (image.length < 1) {
            return;
        }
        if (image[0].name == "controlright") {
            this.keys.right.isDown = true;
        }
        if (image[0].name == "controlleft") {
            this.keys.left.isDown = true;
        }
        if (image[0].name == "controlup") {
            this.keys.up.isDown = true;
        }
        if (image[0].name == "controlenter") {
            this.keys.enter.isDown = true;
        }
    }

    createUI(game) {
        this.infoText = game.add.text(400, 80, 'Info text', {
            fontSize: '30px',
            fill: '#ffffff', 
            align: 'center'
        });
        this.infoText.setScrollFactor(0);
        this.infoText.setShadow(1, 0, 'rgba(0,0,0,0.5)', 5);
        //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
        this.infoText.setOrigin(0.5);
        if (this.selectedLevel) {
            this.setText(this.selectedLevel.getDescription());
        }
    }

    setText(text) {
        this.infoText.setText(text);
    }

    createRoads(game) {
        let i = 0;

        let platformerLevels = this.state.getPlatformerLevels();
        let graphics = game.add.graphics();
            
        // First draw the roads.
        for (i = 0; i < platformerLevels.length; i++) {
            let level = platformerLevels[i];
            let roadColour = 0x555555;
         
            if (level.getCompleted()) {
                roadColour = 0xff9900;
            }
         
            // Connect the levels.
            let nextLevels = level.getNextLevels();
            let j;
            
            // Draw the point for the level.
            graphics.lineStyle(10, roadColour);
            graphics.fillStyle(roadColour);
            graphics.fillCircle(level.getX(), level.getY(), 10);
            
            for (j = 0; j < nextLevels.length; j++) {
                let nextLevel = nextLevels[j];
                let line = new Phaser.Geom.Line(level.getX(), level.getY(), nextLevel.getX(), nextLevel.getY());
                graphics.strokeLineShape(line);
            }
        }
    }

    createPlayer(game) {
        this.player = game.add.image(this.selectedLevel.x, this.selectedLevel.y, 'mapplayer');
        this.player.setScale(0.8);

    }

    loadSelectedLevel() {
        let platformerLevels = this.state.getPlatformerLevels();
        // Remember the selected level.
        this.selectedLevel = platformerLevels[0];
    }

    create(game) {
        super.create(game);
        this.loadSelectedLevel();

        this.backGroundImage = game.add.image(0, 0, 'mainmap');
        
        this.backGroundImage.setOrigin(0, 0);
        this.backGroundImage.setScale(1);
       
        this.createInput(game);

        this.createUI(game); 

        this.createRoads(game);

        this.createPlayer(game);
        
    }

    setSelectedLevel(level, game) {
        this.selectedLevel = level;
        this.player.destroy();
        this.createPlayer(game);
        this.setText(level.getDescription());
    }

    unload(game) {
            
        this.backGroundImage.destroy();
        this.infoText.destroy();
        
    }

    update(game) {
        let currentTime = this.getTime();
        let active = (currentTime - this.lastInput) > 300;

        if ((this.keys.enter.isDown || this.enterDown) && active) {
            this.enterDown = false;
            this.state.loadLevel(this.selectedLevel, game);
            this.lastInput = this.getTime();
        }

        if ((this.keys.right.isDown || this.rightDown) && active) {
            let next = this.selectedLevel.getNextLevels();
            this.rightDown = false;
            if (next.length > 0) {
                this.setSelectedLevel(next[0], game);
            }
            this.lastInput = this.getTime();
        }

        if ((this.keys.left.isDown || this.leftDown) && active) {
            let next = this.selectedLevel.getNextLevels();
            let previous = this.selectedLevel.getPreviousLevels();
            this.leftDown = false;
            if (previous.length > 0) {
                this.setSelectedLevel(previous[0], game);
            }
            this.lastInput = this.getTime();
        }
    }
}
