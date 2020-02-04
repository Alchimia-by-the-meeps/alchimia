// import the tiles
import { tiles } from '../data/tiles.js';

const maxColumns = 12;
const maxRows = 8;

//initialize new game board state variable (array) thing
let gameState = [];


export function makeBlankGameState() {
    
    // Loop through maxRows and create rows
    for (let i = 0; i < maxRows; i++) {
        //make new array for every row in grid array
        gameState.push(new Array());
        //make null placeholder for each cell in grid
        for (let j = 0; j < maxColumns; j++) {
            gameState[i].push(null);
        }
    }
}  

makeBlankGameState();


export function renderGrid(parent) {

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
            row.appendChild(cell);
        }
        // Add row to parent / passed element
        parent.appendChild(row);
    }
}  

// create grid, 12 by 8
//on load
const grid = document.getElementById('grid');
renderGrid(grid);

let topDeckTile = getTileFromDeck();
renderTopDeckTile();

//on click
grid.addEventListener('click', (e) => {
    //grab click location, div id
    const currentTile = e.target;
    let currentTileId = currentTile.id;

    //change 'grid-#-#' string to '#-#'
    currentTileId = currentTileId.replace('grid-', '');
    //change '#-#' to ["#", "#"]
    currentTileId = currentTileId.split('-');

    //store ["#", "#"][0] to row, ["#", "#"][1]
    const row = Number(currentTileId[0]);
    const column = Number(currentTileId[1]);


    gameState[row][column] = topDeckTile.id;
    // console.log(gameState);


    
    //if tile already has background image, do not run
    if (currentTile.style.backgroundImage) return;

    //render tile in grid, update background image
    currentTile.style.opacity = 1;
    currentTile.style.backgroundImage = `url("../tiles/${topDeckTile.image}")`;
    //draw and display new tile at bottom of page
    renderTopDeckTile();

    // getPlacedTiles();

});


function getPlacedTiles() {
    let placedTilesArray = [];

    //loop through all played tile ids in gameState
    gameState.forEach(row => {
        row.forEach(cell => {
            if (cell) placedTilesArray.push(cell);
        });
    });
    console.log('placedTilesArray: ' + placedTilesArray);
    return placedTilesArray;
}


function getUnplayedTiles() {
    const placedTiles = getPlacedTiles();
    let unplayedTiles = Object.keys(tiles).filter(id => {
        return placedTiles.indexOf(Number(id)) < 0;
    });
    console.log('unplayedTiles: ' + unplayedTiles);
    return unplayedTiles;
}



// place starting river tiles ~8

// create deck / get tile function 
function getTileFromDeck() {
    const unplayedTiles = getUnplayedTiles();
    const unplayedTilesIndex = Math.ceil(Math.random() * unplayedTiles.length);
    console.log('unplayedTilesIndex: ' + unplayedTilesIndex);
    console.log('the unplayed tiles index has the id of the actual tiles object, which is this: ' + tiles[unplayedTiles[unplayedTilesIndex]].id);
    return tiles[unplayedTiles[unplayedTilesIndex]];
}


// on click, get grid space id and place tile

// save game state

// generate new tile from 'deck'

//end game button

// 


function renderTopDeckTile() {
    //random tile deck at bottom of page
    const div = document.getElementById('player-tile');
    //select random tile
    topDeckTile = getTileFromDeck();
    //update and display random tile background 
    div.style.opacity = 1;
    div.style.backgroundImage = `url("../tiles/${topDeckTile.image}")`;
    div.style.backgroundSize = 'cover';
}
