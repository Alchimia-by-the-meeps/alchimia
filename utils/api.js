import { tiles } from '../data/tiles.js';
import { addCity } from './city-utils.js';

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

// Delete user stats
export function resetUser() {
    const user = getUser();
    user.cityConnections = 0;
    user.cityCompleted = 0;
    user.roadConnections = 0; 
    user.monasteries = 0;
    user.cities = {};
    saveUser(user);
}

export function getGameState() {
    //if gameState exists in localStorage, set gameState to that function, else initialize and set it to new gameState
    const gameStateData = localStorage.getItem('gameState') ? JSON.parse(localStorage.getItem('gameState')) : initializeGameState();

    if (!gameStateData) return;

    return gameStateData;
    
}

export function initializeGameState() {   
    let gameState = [];
    
    for (let i = 0; i < maxRows; i++) {
        //make new array for every row in grid array
        gameState.push(new Array());
        //make null placeholder for each cell in grid
        for (let j = 0; j < maxColumns; j++) {
            gameState[i].push(null);
        }
    } 

    gameState[2][3] = tiles['73'].id;
    gameState[2][4] = tiles['74'].id;
    gameState[2][5] = tiles['76'].id;
    gameState[3][5] = tiles['82'].id;
    gameState[4][5] = tiles['83'].id;
    gameState[5][5] = tiles['79'].id;
    gameState[5][6] = tiles['81'].id;
    gameState[5][7] = tiles['84'].id;

    gameState = JSON.stringify(gameState);
    localStorage.setItem('gameState', gameState);
    return JSON.parse(gameState);
}

export function initializeCities() {

    // Add in city information from existing river tiles
    addCity(3, 5, 82);
    addCity(5, 5, 79);
    addCity(5, 6, 81);

    // addClassToGameBoard(3, 5, 'city-1');
    // addClassToGameBoard(3, 5, 'city-2');
    // addClassToGameBoard(5, 5, 'city-3');
    // addClassToGameBoard(5, 6, 'city-4');
}

export const tileAboveId = (row, column) => {
    const currentGameState = getGameState();
    if (row > 0 && currentGameState[row - 1][column])
        return currentGameState[row - 1][column];
    else return null;
};       

export const tileToRightId = (row, column) => {
    const currentGameState = getGameState();
    if (column < (maxColumns - 1) && currentGameState[row][column + 1])
        return currentGameState[row][column + 1];
    else return null;
};       

export const tileBelowId = (row, column) => {
    const currentGameState = getGameState();
    if (row < (maxRows - 1) && currentGameState[row + 1][column])
        return currentGameState[row + 1][column];
    else return null;
};       

export const tileToLeftId = (row, column) => {
    const currentGameState = getGameState();
    if (column > 0 && currentGameState[row][column - 1])
        return currentGameState[row][column - 1];
    else return null;
};       

export function addClassToGameBoard(row, column, className) {
    const targetTile = document.getElementById(`grid-${row}-${column}`);
    targetTile.classList.add(className);
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
        cities: lastPlacedTile.cities,
        monastery: lastPlacedTile.monastery ? true : false
    };
    // if (lastPlacedTile.cities) {
    //     placedTiles[lastPlacedTile.id].cities = lastPlacedTile.cities;    
    // }
    localStorage.setItem('placedTiles', JSON.stringify(placedTiles));
}

export function initializePlacedTiles() {
    localStorage.setItem('placedTiles', '{}');
}

export function getTileValidation(row, column, toBePlacedTile) {
    
    //placed tiles is object of objects with tile properties
    const existingPlacedTiles = getPlacedTiles();
    
    let tileAbove = existingPlacedTiles[tileAboveId(row, column)];
    let tileToRight = existingPlacedTiles[tileToRightId(row, column)];
    let tileBelow = existingPlacedTiles[tileBelowId(row, column)];
    let tileToLeft = existingPlacedTiles[tileToLeftId(row, column)];

    let matchAbove = true;
    let matchToRight = true;
    let matchBelow = true;
    let matchToLeft = true;

    // Checking for neighboring tiles and see if the sides match
    if (tileAbove)
        if (tileAbove.sides[2] !== toBePlacedTile.sides[0])
            matchAbove = false;
    if (tileToRight)
        if (tileToRight.sides[3] !== toBePlacedTile.sides[1])
            matchToRight = false;
    if (tileBelow)
        if (tileBelow.sides[0] !== toBePlacedTile.sides[2])
            matchBelow = false;
    if (tileToLeft)
        if (tileToLeft.sides[1] !== toBePlacedTile.sides[3])
            matchToLeft = false;

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

// Delete any existing rows from game board (i.e. resetting)
export function wipeGameBoard(parent) {
    parent.querySelectorAll('section').forEach(element => element.remove());
}

export function renderGameBoard(parent) {
    const maxColumns = 12;
    const maxRows = 8;
    
    // Get boardState from localStorage
    const gameState = getGameState();
    const placedTiles = getPlacedTiles();

    // Loop through maxRows and create rows
    for (let i = 0; i < maxRows; i++) {
        const row = document.createElement('section');
        row.id = `row-${i}`;
        row.classList.add('row');
        
        // Loop through each row and create columns
        for (let j = 0; j < maxColumns; j++) {
            const cell = document.createElement('div');
            cell.id = `grid-${i}-${j}`;
            cell.classList.add('cell');
            // Get ID of corresponding gameState array of arrays
            
            if (gameState[i][j]) {
                const thisCellId = gameState[i][j];
                // console.log(thisCellId);
                cell.style.transform = 'rotate(' + placedTiles[thisCellId].rotation + 'deg)'
                cell.style.backgroundImage = `url('../tiles/${tiles[thisCellId].image}')`;
                cell.classList.add('placed-tile');
            }
            row.appendChild(cell);
        }
        // Add row to parent / passed element
        parent.appendChild(row);
    }
}  