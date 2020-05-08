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
    const processedTileCities = [];
    const translatedDirection = ['top', 'right', 'bottom', 'left'];
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
            console.log(`Checking adjacencies per city side. tileID: ${tileId} side: ${index} has neighbors ${tileAboveId(row, column)} ${tileToRightId(row, column)} ${tileBelowId(row, column)} ${tileToLeftId(row, column)}`);
            // If top (i.e. [0]) of new tile is a city, and there's a tile above... 
            if (index === 0 && tileAboveId(row, column))
                // ... is the adjacent bottom (i.e. [2]) of it a city?
                if (placedTiles[tileAboveId(row, column)].sides[2] === 'city') {
                    const adjacentClassesList = document.getElementById(`grid-${row - 1}-${column}`).classList;                
                    // Derive simple array from weird classList object
                    const adjacentClasses = [...adjacentClassesList];
                    // Pass to processor along with value representing side/direction of tile
                    processExtendingCity(adjacentClasses, 0);
                }
            if (index === 1 && tileToRightId(row, column))
                if (placedTiles[tileToRightId(row, column)].sides[3] === 'city') {
                    const adjacentClassesList = document.getElementById(`grid-${row}-${column + 1}`).classList;                
                    const adjacentClasses = [...adjacentClassesList];
                    processExtendingCity(adjacentClasses, 1);
                }
            if (index === 2 && tileBelowId(row, column))
                if (placedTiles[tileBelowId(row, column)].sides[0] === 'city') {
                    const adjacentClassesList = document.getElementById(`grid-${row + 1}-${column}`).classList;                
                    const adjacentClasses = [...adjacentClassesList];
                    processExtendingCity(adjacentClasses, 2);
                }
            if (index === 3 && tileToLeftId(row, column))
                if (placedTiles[tileToLeftId(row, column)].sides[1] === 'city') {
                    const adjacentClassesList = document.getElementById(`grid-${row}-${column - 1}`).classList;                
                    const adjacentClasses = [...adjacentClassesList];
                    processExtendingCity(adjacentClasses, 3);
                }
        } else processedSides += 1;
    });

    // Check if all sides/cities on tile have been processed (extended). 
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
        console.log(`Adding ${clusterNumber} to user from simple tile ${tileId}: ${cityObj}`);

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
            // Add a new city from tile cities that haven't already been extended
            console.log('processedTileCities', processedTileCities, 'and separateCity', separateCity);
            if (!processedTileCities.includes(separateCity)) {
                cityClusters = Object.keys(user.cities).length;
                clusterNumber = `cluster-${cityClusters}`;
                const cityObj = { 
                    openConnections: reduceObj[separateCity],
                    tileIds: [tileId],
                    gridIds: [`grid-${row}-${column}`]
                };
                user.cities[clusterNumber] = cityObj;
                addClassToGameBoard(row, column, clusterNumber);
                console.log(`Adding ${clusterNumber} to user from complex tile ${tileId}:`, cityObj);
            }      
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
        const splitClasses = splitClassesRaw.filter(item => item[0] === 'cluster');
        console.log('Neighboring tiles contain', splitClasses);
        let clusterNumber;
        // If there's only one city cluster to extend...
        if (splitClasses.length === 1) {
            const splitClass = splitClasses.flat();
            clusterNumber = `${splitClass[0]}-${splitClass[1]}`;
            console.log(`Extending ${clusterNumber} from the ${translatedDirection[direction]}`);
            user.cities[clusterNumber].openConnections -= 2; // Subtract one per connecting side per tile
            user.cities[clusterNumber].openConnections += tileConnections(tileId, direction);
            user.cities[clusterNumber].tileIds.push(tileId);
            user.cities[clusterNumber].gridIds.push(`grid-${row}-${column}`);
            addClassToGameBoard(row, column, clusterNumber);
            processedSides += tileConnections(tileId, direction);
            if (user.cities[clusterNumber].openConnections === 0) {
                console.log(`Completing ${clusterNumber}!`);
                user.cityCompleted++;
            }
        } else {
            console.log(`===`);
            console.log(`Negotiating multiple city clusters... which one do I extend?`);
            // Neighbor contains multiple city clusters.
            // 'Start' a cluster by extending the first cluster without connections
            // REFACTOR? Simply count length of tileIds for each cluster?
            const neighborMatches = [];
          // Use a for loop to break out early once a cluster is assigned
            for (let i = 0; i < splitClasses.length; i++) {
                clusterNumber = `${splitClasses[i][0]}-${splitClasses[i][1]}`;
                neighborMatches[clusterNumber] = 0;
                if (direction === 0 && row > 1) {
                    console.log('looking above for neighbors with', clusterNumber);
                    // console.log('above: ', gridAboveNeighborClasses(row - 1, column), 
                    //     'right: ', gridToRightNeighborClasses(row - 1, column), 
                    //     'left: ', gridToLeftNeighborClasses(row - 1, column));
                    if (gridAboveNeighborClasses(row - 1, column).contains(clusterNumber)) {
                        console.log(`above neighbor matches - ${clusterNumber}`);
                        neighborMatches[clusterNumber]++;
                    }
                    if (gridToRightNeighborClasses(row - 1, column).contains(clusterNumber)) {
                        console.log(`right neighbor matches - ${clusterNumber}`);
                        neighborMatches[clusterNumber]++;
                    }
                    if (gridToLeftNeighborClasses(row - 1, column).contains(clusterNumber)) {
                        console.log(`left neighbor matches - ${clusterNumber}`);
                        neighborMatches[clusterNumber]++;
                    }
                }

                if (direction === 1 && column < (maxColumns - 2)) {
                    console.log('looking to the right for neighbors with', clusterNumber);
                    // console.log('above: ', gridAboveNeighborClasses(row, column + 1), 
                    //     'right: ', gridToRightNeighborClasses(row, column + 1), 
                    //     'below: ', gridBelowNeighborClasses(row, column + 1));
                    if (gridAboveNeighborClasses(row, column + 1).contains(clusterNumber)) {
                        console.log(`top neighbor matches - ${clusterNumber}`);
                        neighborMatches[clusterNumber]++;
                    }
                    if (gridToRightNeighborClasses(row, column + 1).contains(clusterNumber)) {
                        console.log(`right neighbor matches - ${clusterNumber}`);
                        neighborMatches[clusterNumber]++;
                    }
                    if (gridBelowNeighborClasses(row, column + 1).contains(clusterNumber)) {
                        console.log(`below neighbor matches - ${clusterNumber}`);
                        neighborMatches[clusterNumber]++;
                    }
                }

                if (direction === 2 && row < (maxRows - 2)) {
                    console.log('looking below for neighbors with', clusterNumber);
                    // console.log('right: ', gridToRightNeighborClasses(row + 1, column), 
                    //     'below: ', gridBelowNeighborClasses(row + 1, column), 
                    //     'left: ', gridToLeftNeighborClasses(row + 1, column));
                    if (gridToRightNeighborClasses(row + 1, column).contains(clusterNumber)) {
                        console.log(`right neighbor matches - ${clusterNumber}`);
                        neighborMatches[clusterNumber]++;
                    }
                    if (gridBelowNeighborClasses(row + 1, column).contains(clusterNumber)) {
                        console.log(`below neighbor matches - ${clusterNumber}`);
                        neighborMatches[clusterNumber]++;
                    }
                    if (gridToLeftNeighborClasses(row + 1, column).contains(clusterNumber)) {
                        console.log(`left neighbor matches - ${clusterNumber}`);
                        neighborMatches[clusterNumber]++;
                    }
                }

                if (direction === 3 && column > 1) {
                    console.log('looking to the left for neighbors with', clusterNumber);
                    // console.log('above: ', gridAboveNeighborClasses(row, column - 1), 
                    //     'below: ', gridBelowNeighborClasses(row, column - 1), 
                    //     'left: ', gridToLeftNeighborClasses(row, column - 1));
                    if (gridAboveNeighborClasses(row, column - 1).contains(clusterNumber)) { 
                        console.log(`above neighbor matches - ${clusterNumber}`);
                        neighborMatches[clusterNumber]++;
                    }
                    if (gridBelowNeighborClasses(row, column - 1).contains(clusterNumber)) { 
                        console.log(`below neighbor matches - ${clusterNumber}`);
                        neighborMatches[clusterNumber]++;
                    }
                    if (gridToLeftNeighborClasses(row, column - 1).contains(clusterNumber)) { 
                        console.log(`left neighbor matches - ${clusterNumber}`);
                        neighborMatches[clusterNumber]++;
                    }
                }
                // Now that we know if this cluster hasn't already been extended (based on a count of matching neighbors), extend it
                // Otherwise, count next possible cluster
                console.log('neighborMatches is', neighborMatches);
                if (neighborMatches[clusterNumber] === 0) {
                    console.log(`Extending ${clusterNumber} from the ${translatedDirection[direction]} since it hasn't been extended yet'`);
                    user.cities[clusterNumber].openConnections -= 2; // Subtract one per each connecting side
                    console.log(`Calculated tile connections from ${translatedDirection[direction]} (tile rotated ${tiles[tileId].rotation}) is ${tileConnections(tileId, direction)}`);
                    user.cities[clusterNumber].openConnections += tileConnections(tileId, direction);
                    user.cities[clusterNumber].tileIds.push(tileId);
                    user.cities[clusterNumber].gridIds.push(`grid-${row}-${column}`);
                    addClassToGameBoard(row, column, clusterNumber);
                    processedSides += tileConnections(tileId, direction);
                    if (tiles[tileId].cities) {
                        processedTileCities.push(tiles[tileId].cities[direction]);
                    }
                    if (user.cities[clusterNumber].openConnections === 0) {
                        console.log(`Completing ${clusterNumber}!`);
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
    if (!tiles[tileId].cities) {
        openConnections = tiles[tileId].sides.filter(item => item === 'city').length;
    } else {
      // Multiple cities on a tile
        const cityLetter = tiles[tileId].cities[direction];
        openConnections = tiles[tileId].cities.filter(city => city === cityLetter).length;    
    }
    return openConnections;
};