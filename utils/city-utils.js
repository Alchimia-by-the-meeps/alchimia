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
        let clusterNumber;
        // If a complex tile with different individual cities on it...
        if (tiles[tileId].cities) {
            let reduceObj = {};
            console.log('Processing multiple cities on tile to be placed');
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
            reduceArr.forEach((separateCity, index) => {
            // Add a new city
                clusterNumber = `cluster-${index}`;
                const cityObj = { 
                    openConnections: reduceObj[separateCity],
                    tileIds: [tileId],
                    gridIds: [`grid-${row}-${column}`]
                };
                if (!user.cities) user.cities = {};
                user.cities[clusterNumber] = cityObj;
                addClassToGameBoard(row, column, clusterNumber);
                console.log('Adding a new complex city to user:', clusterNumber, cityObj);      
            });
        } else {
        // Simple city tile
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
        // Our job is done here.
        saveUser(user);
        return;
    }
  // Placement has already been validated
  // Check for adjacency to other cities and extend, if possible
    let extend = false;
    placedTiles[tileId].sides.forEach((side, index) => {
        if (side === 'city') {
            console.log('index:', index, 'and neighbors:', tileAboveId(row, column), tileToRightId(row, column), tileBelowId(row, column), tileToLeftId(row, column))
            // If top of new tile is a city, and there's a tile above... 
            if (index === 0 && tileAboveId(row, column))
                // ... is the adjacent bottom of it a city?
                if (placedTiles[tileAboveId(row, column)].sides[2] === 'city') {
                    const adjacentClassesList = document.getElementById(`grid-${row - 1}-${column}`).classList;                
                    // Derive simple array from weird classList object
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
        const cityClusters = Object.keys(user.cities).length;
        clusterNumber = `cluster-${cityClusters + 1}`;
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

