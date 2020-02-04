import { tiles } from '../data/tiles.js';

export function getPlacedTiles(gameState) {
    let placedTilesArray = [];

    //loop through all played tile ids in gameState
    gameState.forEach(row => {
        row.forEach(cell => {
            if (cell) placedTilesArray.push(cell);
        });
    });
    return placedTilesArray;
}


export function getUnplayedTiles(input, tileids) {
    const placedTiles = input;
    let unplayedTiles = tileids.filter(id => {
        return placedTiles.indexOf(Number(id)) < 0;
    });
    return unplayedTiles;
}

export function makeBlankGameState() {
    let gameState = [];
    // Loop through maxRows and create rows
    for (let i = 0; i < maxRows; i++) {
        //make new array for every row in grid array
        gameState.push(new Array());
        //make null placeholder for each cell in grid
        for (let j = 0; j < maxColumns; j++) {
            gameState[i].push(null);
        }
    }
    return gameState;
}  