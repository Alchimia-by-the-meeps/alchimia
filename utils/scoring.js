import { getUser, saveUser, getGameState, getPlacedTiles } from './api.js';

// Calculate 'connections' to neighbor tiles for scoring
export function countConnections(row, column, topDeckTile) {
    const toBePlacedTile = topDeckTile;
    const toBePlacedTileSides = toBePlacedTile.sides;
    
    const tileAboveRow = row - 1;
    const tileAboveColumn = column;

    const tileRightRow = row;
    const tileRightColumn = column + 1;

    const tileBottomRow = row + 1;
    const tileBottomColumn = column;

    const tileLeftRow = row;
    const tileLeftColumn = column - 1;
 
    const currentGameState = getGameState();
    const exisitingPlacedTiles = getPlacedTiles();
    const user = getUser();

    let tileAboveId, tileRightId, tileBottomId, tileLeftId;

    //if neighboring tile exists, store its id
    if (currentGameState[tileAboveRow]) {
        tileAboveId = currentGameState[tileAboveRow][tileAboveColumn];
    }
    if (currentGameState[tileRightRow][tileRightColumn]) {
        tileRightId = currentGameState[tileRightRow][tileRightColumn];
    }   
    if (currentGameState[tileBottomRow]) {
        tileBottomId = currentGameState[tileBottomRow][tileBottomColumn];
    }
    if (currentGameState[tileLeftRow][tileLeftColumn]) {
        tileLeftId = currentGameState[tileLeftRow][tileLeftColumn];
    }

    // get properties from ids
    // match key with tile above id
    // get sides of placed tile 

    const aboveTileSides = tileAboveId ? exisitingPlacedTiles[tileAboveId].sides : null;
    const rightTileSides = tileRightId ? exisitingPlacedTiles[tileRightId].sides : null;
    const bottomTileSides = tileBottomId ? exisitingPlacedTiles[tileBottomId].sides : null;
    const leftTileSides = tileLeftId ? exisitingPlacedTiles[tileLeftId].sides : null;

    // If there are no neighboring tiles, validation is false
    if (!aboveTileSides && !rightTileSides && !bottomTileSides && !leftTileSides){
        return false;
    }

    if (aboveTileSides) {
        if (aboveTileSides[2] === toBePlacedTileSides[0]) {
            // if array contains city or road
            if (toBePlacedTileSides[0] === 'city') {
                user.cityConnections++;
            }
            if (toBePlacedTileSides[0] === 'road') {
                user.roadConnections++;
            }
        } 
    } 
    if (rightTileSides) {
        if (rightTileSides[3] === toBePlacedTileSides[1]) {
            if (toBePlacedTileSides[1] === 'city') {
                user.cityConnections++;
            }
            if (toBePlacedTileSides[1] === 'road') {
                user.roadConnections++;
            }
        } 
    } 
    if (bottomTileSides) {
        if (bottomTileSides[0] === toBePlacedTileSides[2]) {
            if (toBePlacedTileSides[2] === 'city') {
                user.cityConnections++;
            }
            if (toBePlacedTileSides[2] === 'road') {
                user.roadConnections++;
            }
        }
    } 
    if (leftTileSides) {
        if (leftTileSides[1] === toBePlacedTileSides[3]) {
            if (toBePlacedTileSides[3] === 'city') {
                user.cityConnections++;
            }
            if (toBePlacedTileSides[3] === 'road') {
                user.roadConnections++;
            }
        } 
    }

    if (toBePlacedTile.monastery) {
        user.monasteries++;
    }
    saveUser(user);    
}

// Display pseudo-scoring on game board
export function renderConnections() {
    const user = getUser();
    const cityCount = document.getElementById('city-count');
    const roadCount = document.getElementById('road-count');
    const monasteryCount = document.getElementById('monastery-count');

    cityCount.textContent = user.cityConnections * 2;
    roadCount.textContent = user.roadConnections;
    monasteryCount.textContent = user.monasteries;
}

// Display pseudo-scoring in results table
export function renderResultsScore() {
    const user = getUser();
    const cityScoreSpan = document.getElementById('score-cities');
    const roadScoreSpan = document.getElementById('score-roads');
    const monasteryScoreSpan = document.getElementById('score-monastery');
    const totalScoreSpan = document.getElementById('score-total');

    const cityScore = user.cityConnections * 2;
    const roadScore = user.roadConnections;
    const monasteryScore = user.monasteries * 4;
    const totalScore = cityScore + roadScore + monasteryScore;

    cityScoreSpan.textContent = cityScore;
    roadScoreSpan.textContent = roadScore;
    monasteryScoreSpan.textContent = monasteryScore;
    totalScoreSpan.textContent = totalScore;
}





// Additional scoring stretch goals in progress!

// export function getMonasteryArray() {
//     const exisitingPlacedTiles = getPlacedTiles();
//     //loop thrugh and find monisteries
    
//     let newArray = Object.keys(exisitingPlacedTiles).filter(tile => {
//         return exisitingPlacedTiles[tile].monastery === true;
//     });
//     return newArray;
// }

// export function loopThroughMonasteryArray() {
//     const array = getMonasteryArray();
//     array.forEach(monastery => {
//         scoreMonastery(monastery);
//     }); 
// }

// export function scoreMonastery(monasteryTileId) {

//     // let monasteryScore = 0;

//     //get row column coordnates from gamestate
//     const row 
//     const column

//     //get monastery object with id thats passed
//     const monasteryTileSides = monasteryTile.sides;
    
//     const tileAboveRow = row - 1;
//     const tileAboveColumn = column;

//     const tileAboveRightRow = row - 1;
//     const tileAboveRightColumn = column + 1;

//     const tileRightRow = row;
//     const tileRightColumn = column + 1;

//     const tileBottomRightRow = row + 1;
//     const tileBottomRightColumn = column + 1;

//     const tileBottomRow = row + 1;
//     const tileBottomColumn = column;

//     const tileBottomLeftRow = row + 1;
//     const tileBottomLeftColumn = column - 1;

//     const tileLeftRow = row;
//     const tileLeftColumn = column - 1;
 
//     const tileAboveLeftRow = row - 1;
//     const tileAboveLeftColumn = column - 1;

//     const currentGameState = getGameState();
//     const exisitingPlacedTiles = getPlacedTiles();
//     const user = getUser();

//     let tileAboveId, 
//         tileAboveRightId, 
//         tileRightId, 
//         tileBottomRightId, 
//         tileBottomId, 
//         tileBottomLeftId, 
//         tileLeftId,
//         tileAboveLeftId;

//     //checking for above tile

//     //if neighboring tile exists, store its id
//     if (currentGameState[tileAboveRow][tileAboveColumn]) {
//         monasteryScore++;
//     }
//     if (currentGameState[tileAboveRightRow]) {
//         tileAboveRightId = currentGameState[tileAboveRightRow][tileAboveRightColumn];
//     }
//     if (currentGameState[tileRightRow][tileRightColumn]) {
//         tileRightId = currentGameState[tileRightRow][tileRightColumn];
//     }   
//     if (currentGameState[tileBottomRightRow]) {
//         tileBottomRightId = currentGameState[tileBottomRightRow][tileBottomRightColumn];
//     }
//     if (currentGameState[tileBottomRow]) {
//         tileBottomId = currentGameState[tileBottomRow][tileBottomColumn];
//     }
//     if (currentGameState[tileBottomLeftRow]) {
//         tileBottomLeftId = currentGameState[tileBottomLeftRow][tileBottomLeftColumn];
//     }
//     if (currentGameState[tileLeftRow][tileLeftColumn]) {
//         tileLeftId = currentGameState[tileLeftRow][tileLeftColumn];
//     }
//     if (currentGameState[tileAboveLeftRow]) {
//         tileAboveLeftId = currentGameState[tileAboveLeftRow][tileAboveLeftColumn];
//     }
    
     
// }
