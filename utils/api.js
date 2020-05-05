import { tiles } from '../data/tiles.js';

export const maxColumns = 12;
export const maxRows = 8;

//add river tiles to placed tiles on initial
export function addRiverToPlacedTiles() {
    for (let i = 73; i <= 84; i++) {
        updatePlacedTiles(tiles[i]);
    }
}

//add user to local storage
export function saveUser(user) {
    const json = JSON.stringify(user);
    //turn user info into string and set in LS
    localStorage.setItem('user', json);
}
//get user from local storage
export function getUser() {
    const json = localStorage.getItem('user');
    //get user data from LS
    if (!json) return null;
    //if none return null
    const user = JSON.parse(json);
    //parse user info
    return user;
}

export function getGameState() {
    //if gameState exists in localStorage, set gameState to that function, else initialize and set it to new gameState
    const gameStateData = localStorage.getItem('gameState') ? JSON.parse(localStorage.getItem('gameState')) : initializeGameState();

    if (!gameStateData) return;

    return gameStateData;
    
}

export function initializeGameState() {
    
    const riverTiles = tiles;
    let gameState = [];

    for (let i = 0; i < maxRows; i++) {
        //make new array for every row in grid array
        gameState.push(new Array());
        //make null placeholder for each cell in grid
        for (let j = 0; j < maxColumns; j++) {
            gameState[i].push(null);
        }
    } 

    gameState[2][3] = riverTiles['73'].id;
    gameState[2][4] = riverTiles['74'].id;
    gameState[2][5] = riverTiles['76'].id;
    gameState[3][5] = riverTiles['82'].id;
    gameState[4][5] = riverTiles['83'].id;
    gameState[5][5] = riverTiles['79'].id;
    gameState[5][6] = riverTiles['81'].id;
    gameState[5][7] = riverTiles['84'].id;
    

    gameState = JSON.stringify(gameState);
    localStorage.setItem('gameState', gameState);
    return JSON.parse(gameState);
}

export function updateGameState(gameState) {
    const stringyGameState = JSON.stringify(gameState);
    localStorage.setItem('gameState', stringyGameState);
}

export function getPlacedTiles() {
    let placedTiles = localStorage.getItem('placedTiles');
    //if placedTiles exists in localStorage, set placedTiles to that function, else initialize and set it to new placedTiles
    placedTiles = placedTiles ? JSON.parse(placedTiles) : {};
    return placedTiles;
}

export function updatePlacedTiles(lastPlacedTile) {
    let placedTiles = getPlacedTiles();

    placedTiles[lastPlacedTile.id] = {
        id: lastPlacedTile.id,
        sides: lastPlacedTile.sides,
        rotation: lastPlacedTile.rotation,
        monastery: lastPlacedTile.monastery ? true : false
    };
    localStorage.setItem('placedTiles', JSON.stringify(placedTiles));
}

export function initializePlacedTiles() {
    localStorage.setItem('placedTiles', '{}');
}

export function getTileValidation(row, column, toBePlacedTile) {
    
    // get id's of surrounding tiles from local storage
    // getGameState = array of arrays of ids
    const currentGameState = getGameState();
    //placed tiles is object of objects with tile properties
    const existingPlacedTiles = getPlacedTiles();
    
    let tileAboveId = null; 
    let tileToRightId = null;
    let tileBelowId = null;
    let tileToLeftId = null;

    let tileAbove = null;
    let tileToRight = null;
    let tileBelow = null;
    let tileToLeft = null;

    let matchAbove = true;
    let matchToRight = true;
    let matchBelow = true;
    let matchToLeft = true;

    // Checking for neighboring tiles, find their IDs, and see if the sides match
    // Above
    if (row > 0 && currentGameState[row - 1][column]) {
        tileAboveId = currentGameState[row - 1][column];
        tileAbove = existingPlacedTiles[tileAboveId];
        if (tileAbove.sides[2] !== toBePlacedTile.sides[0]) {
            matchAbove = false;
        } 
    } 
    // To the right
    if (column < maxColumns && currentGameState[row][column + 1]) {
        tileToRightId = currentGameState[row][column + 1];
        tileToRight = existingPlacedTiles[tileToRightId];
        if (tileToRight.sides[3] !== toBePlacedTile.sides[1]) {
            matchToRight = false;
        } 
    }   
    // Below
    if (row < maxRows && currentGameState[row + 1][column]) {
        tileBelowId = currentGameState[row + 1][column];
        tileBelow = existingPlacedTiles[tileBelowId];
        if (tileBelow.sides[0] !== toBePlacedTile.sides[2]) {
            matchBelow = false;
        }
    }
    // To the left
    if (column > 0 && currentGameState[row][column - 1]) {
        tileToLeftId = currentGameState[row][column - 1];
        tileToLeft = existingPlacedTiles[tileToLeftId];
        if (tileToLeft.sides[1] !== toBePlacedTile.sides[3]) {
            matchToLeft = false;
        } 
    }

    // Can't place a tile without a neighbor
    if (!tileAbove && !tileToRight && !tileBelow && !tileToLeft){
        return false;
    }
    
    // Return whether it's a valid tile
    if (matchAbove && matchToRight && matchBelow && matchToLeft) {
        return true;
    } else {
        return false;
    }

}