// import the tiles
import { tiles } from '../data/tiles.js';

export function renderGrid(parent) {

    const maxColumns = 12;
    const maxRows = 8;
    
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
    
    //if tile already has background image, do not run
    if (currentTile.style.backgroundImage) return;

    //render tile in grid, update background image
    currentTile.style.opacity = 1;
    currentTile.style.backgroundImage = `url("../tiles/${topDeckTile.image}")`;
    //draw and display new tile at bottom of page
    renderTopDeckTile();


});


// place starting river tiles ~8

// create deck / get tile function 
function getTileFromDeck() {
    const randomTile = Math.ceil(Math.random() * Object.keys(tiles).length);
    return tiles[randomTile];
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
