// import { maxRows, maxColumns } from '../game-board/game-board.js';
import { tiles } from '../data/tiles.js';

// Get results container
const resultsBoard = document.getElementById('grid');

// Render full game board in targeted element
renderGameBoard(resultsBoard);

function renderGameBoard(parent) {
    console.log('running');

    const maxColumns = 12;
    const maxRows = 8;
    
    const gameState = [[null, null, 38, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, 78, null, null, 64],
        [37, null, null, 102, null, 132, null, null, null, null, null, null],
        [null, null, null, 106, 13, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, 73, null, null, null, 139, null],
        [null, null, 52, null, null, null, null, null, 56, null, null, null],
        [129, null, null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, 110, null, 120, null, null, 58, null]];
    
    // Get boardState from localStorage
    // DEPENDENT ON LOCALSTORAGE
    // const gameState = getFromLocalStorage();

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
            // Get ID of corresponding gameState array of arrays
            // DEPENDENT ON LOCALSTORAGE
            if (gameState[i][j]) {
                const thisCellId = gameState[i][j];
                console.log(thisCellId);
                cell.style.backgroundImage = `url('../tiles/${tiles[thisCellId].image}')`;
            }
            row.appendChild(cell);
        }
        // Add row to parent / passed element
        parent.appendChild(row);
    }
}  
