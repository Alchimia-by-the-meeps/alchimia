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

    // addClassToGameBoard(3, 5, 'city-1');
    // addClassToGameBoard(3, 5, 'city-2');
    // addClassToGameBoard(5, 5, 'city-3');
    // addClassToGameBoard(5, 6, 'city-4');
}

const tileAboveId = (row, column) => {
    const currentGameState = getGameState();
    if (row > 0 && currentGameState[row - 1][column])
        return currentGameState[row - 1][column];
    else return null;
};       

const tileAtRightId = (row, column) => {
    const currentGameState = getGameState();
    if (column < (maxColumns - 1) && currentGameState[row][column + 1])
        return currentGameState[row][column + 1];
    else return null;
};       

const tileBelowId = (row, column) => {
    const currentGameState = getGameState();
    if (row < (maxRows - 1) && currentGameState[row + 1][column])
        return currentGameState[row + 1][column];
    else return null;
};       

const tileAtLeftId = (row, column) => {
    const currentGameState = getGameState();
    if (column > 0 && currentGameState[row][column - 1])
        return currentGameState[row][column - 1];
    else return null;
};       


export function addCity(row, column, tileId) {
        
    const user = getUser();
    const placedTiles = getPlacedTiles();
    let clusterNumber;

    function processExtendingCity(gridAboveClassesList, direction) {
        console.log('processing from the', direction);
        const gridAboveClasses = [...gridAboveClassesList];
        if (gridAboveClasses.length > 1) {
            // Or use a regex?
            const splitClasses = [];
            gridAboveClasses.map((oneClass, index) => splitClasses[index] = oneClass.split('-'));
            splitClasses.forEach(oneClass => { 
                if (oneClass[0] === 'cluster') {
                    const clusterNumber = `${oneClass[0]}-${oneClass[1]}`;
                    user.cities[clusterNumber].openConnections -= 2; // Subtract one per each connecting side
                    user.cities[clusterNumber].openConnections += tiles[tileId].sides.filter(item => item === 'city').length;
                    user.cities[clusterNumber].tileIds.push(tileId);
                    user.cities[clusterNumber].gridIds.push(`grid-${row}-${column}`);
                    addClassToGameBoard(row, column, clusterNumber);
                    extend = true;
                    console.log(`Extending ${oneClass[0]}-${oneClass[1]} from the ${direction}`);
                }
            });
        }
    }


    console.log('-----');
    // Initializing first city in user
    if (!user.cities) {
        clusterNumber = 'cluster-1';
        const cityObj = { 
            openConnections: tiles[tileId].sides.filter(item => item === 'city').length,
            tileIds: [tileId],
            gridIds: [`grid-${row}-${column}`]
        };
        user.cities = {};
        user.cities[clusterNumber] = cityObj;
        addClassToGameBoard(row, column, clusterNumber);
        console.log('Initializing first city in user');
    }
    
    // Assume valid placement
    // Check for adjacency
    let extend = false;
    placedTiles[tileId].sides.forEach((side, index) => {
        if (side === 'city') {
            // Use switch here instead?
            // Top is city, check above tile for a city?
            console.log('index:', index, 'and neighbors:', tileAboveId(row, column), tileAtRightId(row, column), tileBelowId(row, column), tileAtLeftId(row, column))
            if (index === 0 && tileAboveId(row, column))
                if (placedTiles[tileAboveId(row, column)].sides[2] === 'city') {
                    const gridAboveClassesList = document.getElementById(`grid-${row - 1}-${column}`).classList;                
                    processExtendingCity(gridAboveClassesList, 'top');
                }
            if (index === 1 && tileAtRightId(row, column))
                if (placedTiles[tileAtRightId(row, column)].sides[3] === 'city') {
                    const gridAboveClassesList = document.getElementById(`grid-${row}-${column + 1}`).classList;                
                    processExtendingCity(gridAboveClassesList, 'right');
                }
            if (index === 2 && tileBelowId(row, column))
                if (placedTiles[tileBelowId(row, column)].sides[0] === 'city') {
                    const gridAboveClassesList = document.getElementById(`grid-${row + 1}-${column}`).classList;                
                    processExtendingCity(gridAboveClassesList, 'bottom');
                }
            if (index === 3 && tileAtLeftId(row, column))
                if (placedTiles[tileAtLeftId(row, column)].sides[1] === 'city') {
                    const gridAboveClassesList = document.getElementById(`grid-${row}-${column - 1}`).classList;                
                    processExtendingCity(gridAboveClassesList, 'left');
                }
        }
    });
    
    // Not adjacent, so start a new city cluster                
    if (!extend) {
        const citiesLength = Object.keys(user.cities).length;
        clusterNumber = `cluster-${citiesLength + 1}`;
        const cityObj = { 
            openConnections: tiles[tileId].sides.filter(item => item === 'city').length,
            tileIds: [tileId],
            gridIds: [`grid-${row}-${column}`]
        };
        user.cities[clusterNumber] = cityObj;
        addClassToGameBoard(row, column, clusterNumber);
        console.log('Adding a new city to user');
    }
    saveUser(user);
}

function addClassToGameBoard(row, column, className) {
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
    if (column < (maxColumns - 1) && currentGameState[row][column + 1]) {
        tileToRightId = currentGameState[row][column + 1];
        tileToRight = existingPlacedTiles[tileToRightId];
        if (tileToRight.sides[3] !== toBePlacedTile.sides[1]) {
            matchToRight = false;
        } 
    }   
    // Below
    if (row < (maxRows - 1) && currentGameState[row + 1][column]) {
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