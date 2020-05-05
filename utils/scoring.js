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
    const cityCompletedCount = document.getElementById('city-completed-count');
    const cityCompletedPoints = document.getElementById('city-completed-points');
    const roadCount = document.getElementById('road-count');
    const monasteryCount = document.getElementById('monastery-count');

    const completedCityPoints = () => {
        let allClusters = Object.keys(user.cities);
        let completedClusters = [];
        allClusters.forEach(cluster => {
            if (user.cities[cluster].openConnections === 0) {
                completedClusters.push(cluster);
            }
        });

        let points = 0;
        console.log('=====');
        console.log('Scoring... allClusters:', allClusters);
        console.log('Scoring... completedClusters:', completedClusters);
        completedClusters.forEach(cluster => { 
            points += user.cities[cluster].tileIds.length * 2;
        });
        return points;
    };

    cityCount.textContent = user.cityConnections * 2;
    // Refactor this? cityCompleted key seems unnecessary -- see comments above.
    cityCompletedCount.textContent = user.cityCompleted;
    cityCompletedPoints.textContent = completedCityPoints();
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
    const monasteryScore = loopThroughMonasteryArray();
    const totalScore = cityScore + roadScore + monasteryScore;

    cityScoreSpan.textContent = cityScore;
    roadScoreSpan.textContent = roadScore;
    monasteryScoreSpan.textContent = monasteryScore;
    totalScoreSpan.textContent = totalScore;
}

export function getMonasteryArray() {
    const exisitingPlacedTiles = getPlacedTiles();
    //loop though and find monasteries
    let newArray = Object.keys(exisitingPlacedTiles).filter(tile => {
        return exisitingPlacedTiles[tile].monastery === true;
    });
    return newArray;
}

export function loopThroughMonasteryArray() {
    const array = getMonasteryArray();
    let monasteryScore = 0;
    array.forEach(monastery => {
        monasteryScore += scoreMonastery(monastery);
    }); 
    return monasteryScore;
}

// Refactor this!
export function scoreMonastery(monasteryTileId) {
    let gameState = getGameState();
    let row;
    let column;
    
    for(let i = 0; i < gameState.length; i++){ 
        console.log(row, column)
        const gameStateResult = gameState[i].indexOf(Number(monasteryTileId));
        if (gameStateResult != -1) {
            row = i;
            column = gameStateResult;
        }
    }
    const tileAboveRow = row - 1;
    const tileAboveColumn = column;
    
    const tileAboveRightRow = row - 1;
    const tileAboveRightColumn = column + 1;
    
    const tileRightRow = row;
    const tileRightColumn = column + 1;
    
    const tileBottomRightRow = row + 1;
    const tileBottomRightColumn = column + 1;
    
    const tileBottomRow = row + 1;
    const tileBottomColumn = column;
    
    const tileBottomLeftRow = row + 1;
    const tileBottomLeftColumn = column - 1;
    
    const tileLeftRow = row;
    const tileLeftColumn = column - 1;
    
    const tileAboveLeftRow = row - 1;
    const tileAboveLeftColumn = column - 1;
    
    let monasteryScore = 1;

    function surroundingCheck(row, column) {
        if (gameState[row][column]) {
            monasteryScore++;
        } 
    }
    surroundingCheck(tileAboveLeftRow, tileAboveLeftColumn);
    surroundingCheck(tileAboveRightRow, tileAboveRightColumn);
    surroundingCheck(tileAboveRow, tileAboveColumn);
    surroundingCheck(tileRightRow, tileRightColumn);
    surroundingCheck(tileBottomLeftRow, tileBottomLeftColumn);
    surroundingCheck(tileBottomRightRow, tileBottomRightColumn);
    surroundingCheck(tileLeftRow, tileLeftColumn);
    surroundingCheck(tileBottomRow, tileBottomColumn);

    return monasteryScore;
}
