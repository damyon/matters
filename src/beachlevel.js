import PlatformerLevel from './platformerlevel.js';

export default class BeachLevel extends PlatformerLevel {
    constructor(name, description, state, x, y) {
        super(name, description, state, x, y);
        this.levelFile = 'assets/levels/beach/map.json';
        
    }
}
