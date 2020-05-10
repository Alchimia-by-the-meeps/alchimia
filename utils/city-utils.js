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
    tileBelowId, 
    updatePlacedTiles
} from './api.js';

export function addCity(row, column, tileId) {
        
    const user = getUser();
    const placedTiles = getPlacedTiles();
    const processedSides = [];
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
    let matchingSides = [];
    let matchingClusters = [];
    console.log(`Checking adjacencies per city side. tileID: ${tileId} has neighbors ${tileAboveId(row, column)} ${tileToRightId(row, column)} ${tileBelowId(row, column)} ${tileToLeftId(row, column)}`);
    placedTiles[tileId].sides.forEach((side, index) => {
        if (side === 'city') {
            // If top (i.e. [0]) of new tile is a city, and there's a tile above... 
            if (index === 0) {
                if (tileAboveId(row, column)) {
                    // ... is the adjacent bottom (i.e. [2]) of it a city?
                    // REFACTOR?: Do this all in a loop?
                    if (placedTiles[tileAboveId(row, column)].sides[2] === 'city') {
                        const adjacentClassesList = document.getElementById(`grid-${row - 1}-${column}`).classList;                
                        // Derive simple array from weird classList object
                        const adjacentClasses = [...adjacentClassesList];
                        // Pass to processor along with value representing side/direction of tile
                        matchingSides.push(index);
                        matchingClusters.push(adjacentClasses.filter(cluster => cluster.match(/cluster/)));
                    } else processedSides.push(index);
                } else processedSides.push(index);
            }

            if (index === 1) {
                if (tileToRightId(row, column)) {
                    if (placedTiles[tileToRightId(row, column)].sides[3] === 'city') {
                        const adjacentClassesList = document.getElementById(`grid-${row}-${column + 1}`).classList;                
                        const adjacentClasses = [...adjacentClassesList];
                        matchingSides.push(index);
                        matchingClusters.push(adjacentClasses.filter(cluster => cluster.match(/cluster/)));
                    } else processedSides.push(index);
                } else processedSides.push(index);
            }

            if (index === 2) {
                if (tileBelowId(row, column)) {
                    if (placedTiles[tileBelowId(row, column)].sides[0] === 'city') {
                        const adjacentClassesList = document.getElementById(`grid-${row + 1}-${column}`).classList;                
                        const adjacentClasses = [...adjacentClassesList];
                        matchingSides.push(index);
                        matchingClusters.push(adjacentClasses.filter(cluster => cluster.match(/cluster/)));
                    } else processedSides.push(index);
                } else processedSides.push(index);
            }
  
            if (index === 3) {
                if (tileToLeftId(row, column)) {
                    if (placedTiles[tileToLeftId(row, column)].sides[1] === 'city') {
                        const adjacentClassesList = document.getElementById(`grid-${row}-${column - 1}`).classList;                
                        const adjacentClasses = [...adjacentClassesList];
                        matchingSides.push(index);
                        matchingClusters.push(adjacentClasses.filter(cluster => cluster.match(/cluster/)));
                    } else processedSides.push(index);                
                } else processedSides.push(index);
            }
        }         
        else processedSides.push(index);
    });

    console.log('Done checking adjacencies', matchingSides);
    console.log('matchingSides:', matchingSides);
    console.log('matchingClusters:', matchingClusters);
    // If multiple sides matched, the new tile must be a merger or a multiple extension
    if (matchingSides.length > 1) {
        // Only one city on this tile, must be a merger
        if (!placedTiles[tileId].cities) {
            console.log('Merger tile detected!');
            // Get merger cluster
            let mergerCluster;
            const mergerSide = matchingSides[0];
            if (mergerSide === 0) {
                if (!placedTiles[tileAboveId(row, column)].cities) {
                    mergerCluster = matchingClusters[0][0];
                } else mergerCluster = placedTiles[tileAboveId(row, column)].cities[2];
            }
            if (mergerSide === 1) {
                if (!placedTiles[tileToRightId(row, column)].cities) {
                    mergerCluster = matchingClusters[0][0];
                } else mergerCluster = placedTiles[tileToRightId(row, column)].cities[3];
            }
            if (mergerSide === 2) {
                if (!placedTiles[tileBelowId(row, column)].cities) {
                    mergerCluster = matchingClusters[0][0];
                } else mergerCluster = placedTiles[tileBelowId(row, column)].cities[0];
            }
            // Not possible for only last side (3) to be merger; that'd be an extension
            console.log('mergerCluster is', mergerCluster);
          
            // Add merging tile
            // REFACTOR: Modularize these user.cities routines
            console.log(`Adding tile ${tileId} to ${mergerCluster}`);
            user.cities[mergerCluster].openConnections -= 2; // ?
            user.cities[mergerCluster].openConnections += tileConnections(tileId); // ?
            user.cities[mergerCluster].tileIds.push(tileId);
            user.cities[mergerCluster].gridIds.push(`grid-${row}-${column}`);

            // Process sides to merge
            // Skip the first matchingSide since it's the merger (but include it in the processedSides count)
            processedSides.push(matchingSides[0]);
            for (let i = 1; i < matchingSides.length; i++) {
                let targetIndex;  
                let targetCluster;  
                if (matchingSides[i] === 1) {
                    if (!placedTiles[tileToRightId(row, column)].cities) {
                        targetIndex = matchingSides.indexOf(i);
                        targetCluster = matchingClusters[targetIndex][0];
                    } else targetCluster = placedTiles[tileToRightId(row, column)].cities[3];
                    console.log(`Merging ${targetCluster} into ${mergerCluster}`);
                }
                if (matchingSides[i] === 2) {
                    if (!placedTiles[tileBelowId(row, column)].cities) {
                        targetIndex = matchingSides.indexOf(i);
                        targetCluster = matchingClusters[targetIndex][0];
                    } else targetCluster = placedTiles[tileBelowId(row, column)].cities[0];
                    console.log(`Merging ${targetCluster} into ${mergerCluster}`);
                }
                if (matchingSides[i] === 3) {
                    if (!placedTiles[tileToLeftId(row, column)].cities) {
                        targetIndex = matchingSides.indexOf(i);
                        targetCluster = matchingClusters[targetIndex][0];
                    } else targetCluster = placedTiles[tileToLeftId(row, column)].cities[1];
                    console.log(`Merging ${targetCluster} into ${mergerCluster}`);
                }
                  
                user.cities[mergerCluster].openConnections -= 2;
                user.cities[mergerCluster].openConnections += user.cities[targetCluster].openConnections;
                user.cities[mergerCluster].tileIds = user.cities[mergerCluster].tileIds.concat(user.cities[targetCluster].tileIds);
                user.cities[mergerCluster].gridIds = user.cities[mergerCluster].gridIds.concat(user.cities[targetCluster].gridIds);
                user.cities[targetCluster] = {};
                processedSides.push(matchingSides[i]);
            }
        }
        else { 
        // CODE HERE for mergers of complex tiles 
        }    
          // Get above tile adjacency cluster #X.
            // Add current tile to cluster #X.
            // Subtract open #X connections by 2
          // Check right tile adjacency for a city
            // If tile city is same (A or none)
              // Merge right side cluster #Y info into #X
              // Subtract open #X connections by 2
              // Delete cluster #Y
            // If tile city is different (B)
              // Add current tile to cluster #Y
              // Subtract open #Y connections by 2
          // Check bottom tile adjacency for a city
            // If tile city is same (A)
              // Merge right side cluster #Y info into #X
              // Subtract open #X connections by 2
              // Delete cluster #Y
            // If tile city is different (B)
              // Add current tile to cluster #Y
              // Subtract open #Y connections by 2

          // For each A adjacency, merge that entire cluster (#Y) into #X
          // Delete #Y
          // 

    }
    // If one side matched, the new city must be an extension
    else if (matchingSides.length === 1) {
        processExtendingCity(matchingClusters, matchingSides[0]);
    }
    

    // Check if all sides/cities on tile have been processed (extended). 
    // If so, save and skip rest of function.
    console.log('processedSides:', processedSides);
    if (processedSides.length === 4 && matchingSides.length !== 0) {
        console.log('All sides processed. Saving user and exiting addCity().');
        saveUser(user);
        return;
    }

    // Then, add a new city if no adjacencies 
    console.log('Checking to make a new city cluster');
    if (!placedTiles[tileId].cities) {
		// Simple city tile
        const cityObj = { 
            openConnections: tileConnections(tileId),
            tileIds: [tileId],
            gridIds: [`grid-${row}-${column}`]
        };
        user.cities[clusterNumber] = cityObj;
        addClassToGameBoard(row, column, clusterNumber);
        console.log(`Adding ${clusterNumber} to user from simple tile ${tileId}:`, cityObj);

    } else {
		// If a complex tile with different individual cities on it...
        console.log('Processing multiple cities on tile to be placed');
        let reduceObj = {};
        placedTiles[tileId].cities.forEach((separateCity, index) => {
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
                // Replace generic tile.cities data ('A', 'B') with cluster name 
                updateCitiesOnPlacedTile(separateCity);
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
    // Takes in an array of cluster names on the adjacent tile 
    // Takes in a number representing the direction of extension from the original tile (0 = top, 1 = right, etc.) 
    // Placed inside addCity() scope to prevent passing tons of variables, and only necessary to addCity.
    function processExtendingCity(adjacentClasses, direction) {
        const splitClassesRaw = [];
        // PROBLEM?
        console.log('About to split classes: ', adjacentClasses);
        adjacentClasses.map(oneClass => { console.log('oneClass is', oneClass); splitClassesRaw.push(oneClass[0].split('-')); });
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
            updateCitiesOnPlacedTile(placedTiles[tileId].cities[direction]);
            addClassToGameBoard(row, column, clusterNumber);
            // processedSides += tileConnections(tileId, direction);
            processedSides.push(direction);
            if (user.cities[clusterNumber].openConnections === 0) {
                console.log(`Completing ${clusterNumber}!`);
                user.cityCompleted++;
            }
        } else {
            console.log(`===`);
            console.log(`Negotiating multiple city clusters... which one do I extend?`);
            // Neighbor contains multiple city clusters.
            // Determine which cluster to extend by 'starting' the first cluster without connections
            const neighborMatches = [];
            // Use a for loop to break out early once a cluster is assigned
            splitClasses.forEach(splitClass => {
                clusterNumber = `${splitClass[0]}-${splitClass[1]}`;
                neighborMatches.push(clusterNumber);
            });
            // Now extend the first cluster that hasn't already been extended
            console.log('neighborMatches is', neighborMatches);
            for (let i = 0; i < neighborMatches.length; i++) {
                clusterNumber = neighborMatches[i];
                if (user.cities[clusterNumber].tileIds.length === 1) {
                    console.log(`Extending ${clusterNumber} from the ${translatedDirection[direction]} since it hasn't been extended yet'`);
                    user.cities[clusterNumber].openConnections -= 2; // Subtract one per each connecting side
                    console.log(`Calculated tile connections from ${translatedDirection[direction]} (tile rotated ${placedTiles[tileId].rotation}) is ${tileConnections(tileId, direction)}`);
                    user.cities[clusterNumber].openConnections += tileConnections(tileId, direction);
                    user.cities[clusterNumber].tileIds.push(tileId);
                    user.cities[clusterNumber].gridIds.push(`grid-${row}-${column}`);
                    addClassToGameBoard(row, column, clusterNumber);
                    processedSides.push(direction);
                    // If this is part of a complex tile, add this city component to the 'done' list 
                    if (placedTiles[tileId].cities) {
                        processedTileCities.push(placedTiles[tileId].cities[direction]);
                    }
                    if (user.cities[clusterNumber].openConnections === 0) {
                        console.log(`Completing ${clusterNumber}!`);
                        user.cityCompleted++;
                    }
                    // Success! Kill the for loop.
                    break;
                }
            }
        }
    }
    
    // Helper function. 
    // Replace generic tile.cities data ('A', 'B') with cluster name 
    function updateCitiesOnPlacedTile(separateCity) {
        for (let i = 0; i < 4; i++) {
            if (placedTiles[tileId].cities[i] === separateCity) {
                placedTiles[tileId].cities[i] = clusterNumber; 
            }
            updatePlacedTiles(placedTiles[tileId]);
        }
    }

}

const tileConnections = (tileId, direction) => {
    const placedTiles = getPlacedTiles();
    let openConnections;
    if (!tiles[tileId].cities) {
        openConnections = placedTiles[tileId].sides.filter(item => item === 'city').length;
    } else {
      // Multiple cities on a tile
        const cityLetter = placedTiles[tileId].cities[direction];
        openConnections = placedTiles[tileId].cities.filter(city => city === cityLetter).length;    
    }
    return openConnections;
};

// Extracted from processExtendingCity after neighborMatches definition.
// Switched to simpler method.
// Consider using as helper function, i.e. "function tallyNeighborClasses()"?
// for (let i = 0; i < splitClasses.length; i++) {
//   clusterNumber = `${splitClasses[i][0]}-${splitClasses[i][1]}`;
//   neighborMatches[clusterNumber] = 0;
//   if (direction === 0 && row > 1) {
//       console.log('looking above for neighbors with', clusterNumber);
//       // console.log('above: ', gridAboveNeighborClasses(row - 1, column), 
//       //     'right: ', gridToRightNeighborClasses(row - 1, column), 
//       //     'left: ', gridToLeftNeighborClasses(row - 1, column));
//       if (gridAboveNeighborClasses(row - 1, column).contains(clusterNumber)) {
//           console.log(`above neighbor matches - ${clusterNumber}`);
//           neighborMatches[clusterNumber]++;
//       }
//       if (gridToRightNeighborClasses(row - 1, column).contains(clusterNumber)) {
//           console.log(`right neighbor matches - ${clusterNumber}`);
//           neighborMatches[clusterNumber]++;
//       }
//       if (gridToLeftNeighborClasses(row - 1, column).contains(clusterNumber)) {
//           console.log(`left neighbor matches - ${clusterNumber}`);
//           neighborMatches[clusterNumber]++;
//       }
//   }

//   if (direction === 1 && column < (maxColumns - 2)) {
//       console.log('looking to the right for neighbors with', clusterNumber);
//       // console.log('above: ', gridAboveNeighborClasses(row, column + 1), 
//       //     'right: ', gridToRightNeighborClasses(row, column + 1), 
//       //     'below: ', gridBelowNeighborClasses(row, column + 1));
//       if (gridAboveNeighborClasses(row, column + 1).contains(clusterNumber)) {
//           console.log(`top neighbor matches - ${clusterNumber}`);
//           neighborMatches[clusterNumber]++;
//       }
//       if (gridToRightNeighborClasses(row, column + 1).contains(clusterNumber)) {
//           console.log(`right neighbor matches - ${clusterNumber}`);
//           neighborMatches[clusterNumber]++;
//       }
//       if (gridBelowNeighborClasses(row, column + 1).contains(clusterNumber)) {
//           console.log(`below neighbor matches - ${clusterNumber}`);
//           neighborMatches[clusterNumber]++;
//       }
//   }

//   if (direction === 2 && row < (maxRows - 2)) {
//       console.log('looking below for neighbors with', clusterNumber);
//       // console.log('right: ', gridToRightNeighborClasses(row + 1, column), 
//       //     'below: ', gridBelowNeighborClasses(row + 1, column), 
//       //     'left: ', gridToLeftNeighborClasses(row + 1, column));
//       if (gridToRightNeighborClasses(row + 1, column).contains(clusterNumber)) {
//           console.log(`right neighbor matches - ${clusterNumber}`);
//           neighborMatches[clusterNumber]++;
//       }
//       if (gridBelowNeighborClasses(row + 1, column).contains(clusterNumber)) {
//           console.log(`below neighbor matches - ${clusterNumber}`);
//           neighborMatches[clusterNumber]++;
//       }
//       if (gridToLeftNeighborClasses(row + 1, column).contains(clusterNumber)) {
//           console.log(`left neighbor matches - ${clusterNumber}`);
//           neighborMatches[clusterNumber]++;
//       }
//   }

//   if (direction === 3 && column > 1) {
//       console.log('looking to the left for neighbors with', clusterNumber);
//       // console.log('above: ', gridAboveNeighborClasses(row, column - 1), 
//       //     'below: ', gridBelowNeighborClasses(row, column - 1), 
//       //     'left: ', gridToLeftNeighborClasses(row, column - 1));
//       if (gridAboveNeighborClasses(row, column - 1).contains(clusterNumber)) { 
//           console.log(`above neighbor matches - ${clusterNumber}`);
//           neighborMatches[clusterNumber]++;
//       }
//       if (gridBelowNeighborClasses(row, column - 1).contains(clusterNumber)) { 
//           console.log(`below neighbor matches - ${clusterNumber}`);
//           neighborMatches[clusterNumber]++;
//       }
//       if (gridToLeftNeighborClasses(row, column - 1).contains(clusterNumber)) { 
//           console.log(`left neighbor matches - ${clusterNumber}`);
//           neighborMatches[clusterNumber]++;
//       }
//   }


// These are helper functions for the above tallyNeighborClasses code
// const gridAboveNeighborClasses = (row, column) => {
//   if (row > 0) {
//       const neighbor = document.getElementById(`grid-${row - 1}-${column}`);
//       return neighbor.classList;
//   } else return null;
// };       

// const gridToRightNeighborClasses = (row, column) => {
//   if (column < (maxColumns - 1)) {
//       const neighbor = document.getElementById(`grid-${row}-${column + 1}`);
//       return neighbor.classList;
//   } else return null;
// };       

// const gridBelowNeighborClasses = (row, column) => {
//   if (row < (maxRows - 1)) {
//       const neighbor = document.getElementById(`grid-${row + 1}-${column}`);
//       return neighbor.classList;
//   } else return null;
// };       

// const gridToLeftNeighborClasses = (row, column) => {
//   if (column > 0) {
//       const neighbor = document.getElementById(`grid-${row}-${column - 1}`);
//       return neighbor.classList;
//   } else return null;
// };       
