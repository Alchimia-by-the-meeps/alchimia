import { tiles } from '../data/tiles.js';
import { 
    maxRows, 
    maxColumns,
    getUser,
    saveUser,
    getPlacedTiles, 
    addClassToGameBoard, 
    tileAboveId, 
    tileToLeftId, 
    tileToRightId, 
    tileBelowId 
} from './api.js';

export function addCity(row, column, tileId) {
        
    const user = getUser();
    const placedTiles = getPlacedTiles();
    let processedSides = 0;
    let clusterNumber;
    let cityClusters = Object.keys(user.cities).length;
    clusterNumber = `cluster-${cityClusters}`;

    // Either extend a city or add a new city (i.e. no adjaciencies)
    // Note: Placement has already been validated

    console.log('---');
    console.log(`Starting to processing tile ${tileId}`);

    // First, check for adjacency to other cities and extend, if possible
    placedTiles[tileId].sides.forEach((side, index) => {
        if (side === 'city') {
            console.log(`Checking adjacencies. tileID: ${tileId} side: ${index} has neighbors ${tileAboveId(row, column)} ${tileToRightId(row, column)} ${tileBelowId(row, column)} ${tileToLeftId(row, column)}`);
            // If top (i.e. [0]) of new tile is a city, and there's a tile above... 
            if (index === 0 && tileAboveId(row, column))
                // ... is the adjacent bottom (i.e. [2]) of it a city?
                if (placedTiles[tileAboveId(row, column)].sides[2] === 'city') {
                    const adjacentClassesList = document.getElementById(`grid-${row - 1}-${column}`).classList;                
                    // Derive simple array from weird classList object
                    const adjacentClasses = [...adjacentClassesList];
                    processExtendingCity(adjacentClasses, 'above');
                }
            if (index === 1 && tileToRightId(row, column))
                if (placedTiles[tileToRightId(row, column)].sides[3] === 'city') {
                    const adjacentClassesList = document.getElementById(`grid-${row}-${column + 1}`).classList;                
                    const adjacentClasses = [...adjacentClassesList];
                    processExtendingCity(adjacentClasses, 'right');
                }
            if (index === 2 && tileBelowId(row, column))
                if (placedTiles[tileBelowId(row, column)].sides[0] === 'city') {
                    const adjacentClassesList = document.getElementById(`grid-${row + 1}-${column}`).classList;                
                    const adjacentClasses = [...adjacentClassesList];
                    processExtendingCity(adjacentClasses, 'below');
                }
            if (index === 3 && tileToLeftId(row, column))
                if (placedTiles[tileToLeftId(row, column)].sides[1] === 'city') {
                    const adjacentClassesList = document.getElementById(`grid-${row}-${column - 1}`).classList;                
                    const adjacentClasses = [...adjacentClassesList];
                    processExtendingCity(adjacentClasses, 'left');
                }
        } else processedSides += 1;
    });

    // Check if all cities on tile have been processed (extended). 
    // If so, save and skip rest of function.
    console.log('processedSides:', processedSides);
    if (processedSides === 4) {
        console.log('Saving user and exiting function early');
        saveUser(user);
        return;
    }

    // Then, add a new city if no adjacencies 
    console.log('Checking to make a new city cluster');
    if (!tiles[tileId].cities) {
		// Simple city tile
        const cityObj = { 
            openConnections: tileConnections(tileId),
            tileIds: [tileId],
            gridIds: [`grid-${row}-${column}`]
        };
        user.cities[clusterNumber] = cityObj;
        addClassToGameBoard(row, column, clusterNumber);
        console.log(`Adding ${clusterNumber} to user from simple tile ${tileId}`);

    } else {
		// If a complex tile with different individual cities on it...
        console.log('Processing multiple cities on tile to be placed');
        let reduceObj = {};
        tiles[tileId].cities.forEach((separateCity, index) => {
            console.log(`separateCity[${index}] is ${separateCity}`);
            if (separateCity) 
                if (!reduceObj[separateCity]) {
                    reduceObj[separateCity] = 1;
                } else reduceObj[separateCity]++;
        });
        const reduceArr = Object.keys(reduceObj);
        console.log('reduceObj is', reduceObj);
        console.log('reduceArr is', reduceArr);
        reduceArr.forEach(separateCity => {
        // Add a new city
            cityClusters = Object.keys(user.cities).length;
            clusterNumber = `cluster-${cityClusters}`;
            const cityObj = { 
                openConnections: reduceObj[separateCity],
                tileIds: [tileId],
                gridIds: [`grid-${row}-${column}`]
            };
            user.cities[clusterNumber] = cityObj;
            addClassToGameBoard(row, column, clusterNumber);
            console.log('Adding a new complex city to user:', clusterNumber, cityObj);      
        });
    }

    // Our job is done here.
    console.log('Saving user');
    saveUser(user);

	

    // Helper function. 
    // Placed inside addCity() scope to prevent passing tons of variables, and only necessary to addCity.
    function processExtendingCity(adjacentClasses, direction) {
        const splitClassesRaw = [];
        adjacentClasses.map((oneClass, index) => splitClassesRaw[index] = oneClass.split('-'));
        console.log('splitClassesRaw is', splitClassesRaw);
        const splitClasses = splitClassesRaw.filter(item => item[0] === 'cluster');
        console.log('splitClasses is', splitClasses, 'and has length', splitClasses.length);
        // If there's only one city cluster to extend...
        if (splitClasses.length === 1) {
            const splitClass = splitClasses.flat();
            console.log(`Extending ${splitClass[0]}-${splitClass[1]} from the ${direction}`);
            const clusterNumber = `${splitClass[0]}-${splitClass[1]}`;
            user.cities[clusterNumber].openConnections -= 2; // Subtract one per connecting side per tile
            user.cities[clusterNumber].openConnections += tileConnections(tileId, direction);
            user.cities[clusterNumber].tileIds.push(tileId);
            user.cities[clusterNumber].gridIds.push(`grid-${row}-${column}`);
            addClassToGameBoard(row, column, clusterNumber);
            // extend = true;
            processedSides += tileConnections(tileId, direction);
            if (user.cities[clusterNumber].openConnections === 0) {
                console.log(`Completing ${splitClass[0]}-${splitClass[1]}!`);
                user.cityCompleted++;
            }
        } else {
            console.log(`===`);
            console.log(`Negotiating multiple city clusters...`);
            // Neighbor contains multiple city clusters.
            // 'Start' a cluster by extending the first cluster without connections
            // REFACTOR? Simply count length of tileIds for each cluster?
            const neighborMatches = [];
          // Use a for loop to break out early once a cluster is assigned
            for (let i = 0; i < splitClasses.length; i++) {
                const oneClass = splitClasses[i];
                neighborMatches[`${oneClass[0]}-${oneClass[1]}`] = 0;
                if (direction === 'above' && row > 1) {
                    console.log('looking above for', `${oneClass[0]}-${oneClass[1]}`);
                    console.log('above: ', gridAboveNeighborClasses(row - 1, column), 
                        'right: ', gridToRightNeighborClasses(row - 1, column), 
                        'left: ', gridToLeftNeighborClasses(row - 1, column));
                    if (gridAboveNeighborClasses(row - 1, column).contains(`${oneClass[0]}-${oneClass[1]}`)) {
                        console.log(`above neighbor matches - ${oneClass[0]}-${oneClass[1]}`);
                        neighborMatches[`${oneClass[0]}-${oneClass[1]}`]++;
                    }
                    if (gridToRightNeighborClasses(row - 1, column).contains(`${oneClass[0]}-${oneClass[1]}`)) {
                        console.log(`right neighbor matches - ${oneClass[0]}-${oneClass[1]}`);
                        neighborMatches[`${oneClass[0]}-${oneClass[1]}`]++;
                    }
                    if (gridToLeftNeighborClasses(row - 1, column).contains(`${oneClass[0]}-${oneClass[1]}`)) {
                        console.log(`left neighbor matches - ${oneClass[0]}-${oneClass[1]}`);
                        neighborMatches[`${oneClass[0]}-${oneClass[1]}`]++;
                    }
                }

                if (direction === 'right' && column < (maxColumns - 2)) {
                    console.log('looking to the right for', `${oneClass[0]}-${oneClass[1]}`);
                    console.log('above: ', gridAboveNeighborClasses(row, column + 1), 
                        'right: ', gridToRightNeighborClasses(row, column + 1), 
                        'below: ', gridBelowNeighborClasses(row, column + 1));
                    if (gridAboveNeighborClasses(row, column + 1).contains(`${oneClass[0]}-${oneClass[1]}`)) {
                        console.log(`top neighbor matches - ${oneClass[0]}-${oneClass[1]}`);
                        neighborMatches[`${oneClass[0]}-${oneClass[1]}`]++;
                    }
                    if (gridToRightNeighborClasses(row, column + 1).contains(`${oneClass[0]}-${oneClass[1]}`)) {
                        console.log(`right neighbor matches - ${oneClass[0]}-${oneClass[1]}`);
                        neighborMatches[`${oneClass[0]}-${oneClass[1]}`]++;
                    }
                    if (gridBelowNeighborClasses(row, column + 1).contains(`${oneClass[0]}-${oneClass[1]}`)) {
                        console.log(`below neighbor matches - ${oneClass[0]}-${oneClass[1]}`);
                        neighborMatches[`${oneClass[0]}-${oneClass[1]}`]++;
                    }
                }

                if (direction === 'below' && row < (maxRows - 2)) {
                    console.log('looking below for', `${oneClass[0]}-${oneClass[1]}`);
                    console.log('right: ', gridToRightNeighborClasses(row + 1, column), 
                        'below: ', gridBelowNeighborClasses(row + 1, column), 
                        'left: ', gridToLeftNeighborClasses(row + 1, column));
                    if (gridToRightNeighborClasses(row + 1, column).contains(`${oneClass[0]}-${oneClass[1]}`)) {
                        console.log(`right neighbor matches - ${oneClass[0]}-${oneClass[1]}`);
                        neighborMatches[`${oneClass[0]}-${oneClass[1]}`]++;
                    }
                    if (gridBelowNeighborClasses(row + 1, column).contains(`${oneClass[0]}-${oneClass[1]}`)) {
                        console.log(`below neighbor matches - ${oneClass[0]}-${oneClass[1]}`);
                        neighborMatches[`${oneClass[0]}-${oneClass[1]}`]++;
                    }
                    if (gridToLeftNeighborClasses(row + 1, column).contains(`${oneClass[0]}-${oneClass[1]}`)) {
                        console.log(`left neighbor matches - ${oneClass[0]}-${oneClass[1]}`);
                        neighborMatches[`${oneClass[0]}-${oneClass[1]}`]++;
                    }
                }

                if (direction === 'left' && column > 1) {
                    console.log('looking to the left for', `${oneClass[0]}-${oneClass[1]}`);
                    console.log('above: ', gridAboveNeighborClasses(row, column - 1), 
                        'below: ', gridBelowNeighborClasses(row, column - 1), 
                        'left: ', gridToLeftNeighborClasses(row, column - 1));
                    if (gridAboveNeighborClasses(row, column - 1).contains(`${oneClass[0]}-${oneClass[1]}`)) { 
                        console.log(`above neighbor matches - ${oneClass[0]}-${oneClass[1]}`);
                        neighborMatches[`${oneClass[0]}-${oneClass[1]}`]++;
                    }
                    if (gridBelowNeighborClasses(row, column - 1).contains(`${oneClass[0]}-${oneClass[1]}`)) { 
                        console.log(`below neighbor matches - ${oneClass[0]}-${oneClass[1]}`);
                        neighborMatches[`${oneClass[0]}-${oneClass[1]}`]++;
                    }
                    if (gridToLeftNeighborClasses(row, column - 1).contains(`${oneClass[0]}-${oneClass[1]}`)) { 
                        console.log(`left neighbor matches - ${oneClass[0]}-${oneClass[1]}`);
                        neighborMatches[`${oneClass[0]}-${oneClass[1]}`]++;
                    }
                }

                console.log('neighborMatches is', neighborMatches);
                if (neighborMatches[`${oneClass[0]}-${oneClass[1]}`] === 0) {
                    console.log(`Multi-matches and extending ${oneClass[0]}-${oneClass[1]} from the ${direction}`);
                    const clusterNumber = `${oneClass[0]}-${oneClass[1]}`;
                    user.cities[clusterNumber].openConnections -= 2; // Subtract one per each connecting side
                    console.log(`Calculated tile connections from ${direction} (tile rotated ${tiles[tileId].rotation}) is ${tileConnections(tileId, direction)}`);
                    user.cities[clusterNumber].openConnections += tileConnections(tileId, direction);
                    user.cities[clusterNumber].tileIds.push(tileId);
                    user.cities[clusterNumber].gridIds.push(`grid-${row}-${column}`);
                    addClassToGameBoard(row, column, clusterNumber);
                    // extend = true;
                    processedSides += tileConnections(tileId, direction);
                    if (user.cities[clusterNumber].openConnections === 0) {
                        console.log(`Completing ${oneClass[0]}-${oneClass[1]}!`);
                        user.cityCompleted++;
                    }
                    break;
                }

            }
        }
    }

}

const gridAboveNeighborClasses = (row, column) => {
    if (row > 0) {
        const neighbor = document.getElementById(`grid-${row - 1}-${column}`);
        console.log(neighbor.classList);
        return neighbor.classList;
    } else return null;
};       

const gridToRightNeighborClasses = (row, column) => {
    if (column < (maxColumns - 1)) {
        const neighbor = document.getElementById(`grid-${row}-${column + 1}`);
        return neighbor.classList;
    } else return null;
};       

const gridBelowNeighborClasses = (row, column) => {
    if (row < (maxRows - 1)) {
        const neighbor = document.getElementById(`grid-${row + 1}-${column}`);
        return neighbor.classList;
    } else return null;
};       

const gridToLeftNeighborClasses = (row, column) => {
    if (column > 0) {
        const neighbor = document.getElementById(`grid-${row}-${column - 1}`);
        return neighbor.classList;
    } else return null;
};       

const tileConnections = (tileId, direction) => {
    let openConnections;
    if (!tiles[tileId].cities || !direction) {
        openConnections = tiles[tileId].sides.filter(item => item === 'city').length;
    } else {
      // Multiple cities on a tile
        let cityLetter;
        if (direction === 'above') cityLetter = tiles[tileId].cities[0];
        if (direction === 'right') cityLetter = tiles[tileId].cities[1];
        if (direction === 'below') cityLetter = tiles[tileId].cities[2];
        if (direction === 'left') cityLetter = tiles[tileId].cities[3];
        openConnections = tiles[tileId].cities.filter(city => city === cityLetter);    
    }
    return openConnections;
};