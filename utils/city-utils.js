import { tiles } from '../data/tiles.js';
import { getUser,
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
    let clusterNumber;

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
  
  // Placement has already been validated
  // Check for adjacency to other cities and extend, if possible
    let extend = false;
    placedTiles[tileId].sides.forEach((side, index) => {
        if (side === 'city') {
          // Top is city, check above tile for a city?
            console.log('index:', index, 'and neighbors:', tileAboveId(row, column), tileToRightId(row, column), tileBelowId(row, column), tileToLeftId(row, column))
            if (index === 0 && tileAboveId(row, column))
                if (placedTiles[tileAboveId(row, column)].sides[2] === 'city') {
                    const adjacentClassesList = document.getElementById(`grid-${row - 1}-${column}`).classList;                
                    // Get simple array from weird classList object
                    const adjacentClasses = [...adjacentClassesList];
                    processExtendingCity(adjacentClasses, 'top');
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
                    processExtendingCity(adjacentClasses, 'bottom');
                }
            if (index === 3 && tileToLeftId(row, column))
                if (placedTiles[tileToLeftId(row, column)].sides[1] === 'city') {
                    const adjacentClassesList = document.getElementById(`grid-${row}-${column - 1}`).classList;                
                    const adjacentClasses = [...adjacentClassesList];
                    processExtendingCity(adjacentClasses, 'left');
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


    // Helper function. 
    // Placed inside addCity() scope to prevent passing tons of variables, and only necessary to addCity.
    function processExtendingCity(adjacentClasses, direction) {
        if (adjacentClasses.length > 1) {
        // Or use a regex?
            const splitClasses = [];
            adjacentClasses.map((oneClass, index) => splitClasses[index] = oneClass.split('-'));
            splitClasses.forEach(oneClass => { 
            // If split class shows a city cluster...
                if (oneClass[0] === 'cluster') {
                    console.log(`Extending ${oneClass[0]}-${oneClass[1]} from the ${direction}`);
                    const clusterNumber = `${oneClass[0]}-${oneClass[1]}`;
                    user.cities[clusterNumber].openConnections -= 2; // Subtract one per each connecting side
                    user.cities[clusterNumber].openConnections += tiles[tileId].sides.filter(item => item === 'city').length;
                    user.cities[clusterNumber].tileIds.push(tileId);
                    user.cities[clusterNumber].gridIds.push(`grid-${row}-${column}`);
                    addClassToGameBoard(row, column, clusterNumber);
                    extend = true;
                    if (user.cities[clusterNumber].openConnections === 0) {
                        console.log(`Completing ${oneClass[0]}-${oneClass[1]}!`);
                        user.cityCompleted++;
                    }
                }
            });
        }
    }
}

