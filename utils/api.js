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

export function getTileValidation(row, column, topDeckTile) {
    const topDeckTileSides = topDeckTile.sides;
 
    // get id's of surrounding tiles from local storage
    //getGameState = array of arrays of ids
    const currentGameState = getGameState();
    //placed tiles is object of objects with tile properties
    const exisitingPlacedTiles = getPlacedTiles();
    
    let tileAboveId, tileRightId, tileBottomId, tileLeftId;

    //checking for above tile

    if (currentGameState[row - 1]) {
        //if tile above exists, store its id
        tileAboveId = currentGameState[row - 1][column];
    } // checking for right tile
    if (currentGameState[row][column + 1]) {
        //if tile right exists, store its id
        tileRightId = currentGameState[row][column + 1];
    }   
    if (currentGameState[row + 1]) {
        //if tile Bottom exists, store its id
        tileBottomId = currentGameState[row + 1][column];
    }
    if (currentGameState[row][column - 1]) {
        //if tile Left exists, store its id
        tileLeftId = currentGameState[row][column - 1];
    }

    const aboveTileSides = tileAboveId ? exisitingPlacedTiles[tileAboveId].sides : null;
    const rightTileSides = tileRightId ? exisitingPlacedTiles[tileRightId].sides : null;
    const bottomTileSides = tileBottomId ? exisitingPlacedTiles[tileBottomId].sides : null;
    const leftTileSides = tileLeftId ? exisitingPlacedTiles[tileLeftId].sides : null;
    // ["grass", "city", "road", "city"]

    if (!aboveTileSides && !rightTileSides && !bottomTileSides && !leftTileSides){
        return false;
    }
// if we have a tile above, grab its sides
    let match0 = true;
    let match1 = true;
    let match2 = true;
    let match3 = true;

    if (aboveTileSides) {
        if (aboveTileSides[2] !== topDeckTileSides[0]) {
            match0 = false;
        } else { //if match
            countSides(topDeckTileSides[0]);
        }
    } 
    if (rightTileSides) {
        if (rightTileSides[3] !== topDeckTileSides[1]) {
            match1 = false;
        } else {
            countSides(topDeckTileSides[1]);
        }
    } 
    if (bottomTileSides) {
        if (bottomTileSides[0] !== topDeckTileSides[2]) {
            match2 = false;
        } else {
            countSides(topDeckTileSides[2]);
        }
    } 
    if (leftTileSides) {
        if (leftTileSides[1] !== topDeckTileSides[3]) {
            match3 = false;
        } else {
            countSides(topDeckTileSides[3]);
        }
    }

    countMonasteries(topDeckTile);
     
    if (match0 && match1 && match2 && match3) {
        return true;
    } else {
        return false;
    }

}

function countMonasteries(topDeckTile) {
    const user = getUser();

    if (topDeckTile.monastery) {
        user.monasteries++;
    }

    saveUser(user);
}

function countSides(sideToCheck) {
    const user = getUser();

    if (sideToCheck === 'city') {
        user.cityConnections++;
    } else if (sideToCheck === 'road') {
        user.roadConnections++;
    }

    saveUser(user);
}