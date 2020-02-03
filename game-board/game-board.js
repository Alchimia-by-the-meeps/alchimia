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
const grid = document.getElementById('grid');
renderGrid(grid);

grid.addEventListener('click', (e) => {
    const currentTile = e.target;
    console.log(currentTile.id);
    currentTile.style.opacity = 1;
    currentTile.style.backgroundImage = `url("../tiles/${retrievedTile.image}")`;
    getRandomTile();
});


// place starting river tiles ~8

// create deck / get tile function 
function getRandomTile() {
    const randomTile = Math.ceil(Math.random() * Object.keys(tiles).length);
    return tiles[randomTile];
}


// on click, get grid space id and place tile

// save game state

// generate new tile from 'deck'

//end game button

// 

const retrievedTile = getRandomTile();
const div = document.getElementById('player-tile');
div.style.opacity = 1;
console.log(retrievedTile.image);
div.style.backgroundImage = `url("../tiles/${retrievedTile.image}")`;
div.style.backgroundSize = 'cover';
// container.appendChild(div);