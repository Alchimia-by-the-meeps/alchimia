//import { maxRows, maxColumns } from '../game-board/game-board.js';
import { tiles } from '../data/tiles.js';
import { getUser, getGameState } from '../utils/api.js';


function renderGameBoard(parent) {
    const maxColumns = 12;
    const maxRows = 8;
    
    // Get boardState from localStorage
    const gameState = getGameState();

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
            
            if (gameState[i][j]) {
                const thisCellId = gameState[i][j];
                console.log(thisCellId);
                cell.style.backgroundImage = `url('../tiles/${tiles[thisCellId].image}')`;
                cell.classList.add('placed-tile');
            }
            row.appendChild(cell);
        }
        // Add row to parent / passed element
        parent.appendChild(row);
    }
}  



// Run On Load

// Get results container
const resultsBoard = document.getElementById('grid');

// Get user from localStorage and add to DOM
const user = getUser();
if (user) {
    const username = document.getElementById('username-span');
    username.textContent = user.name;
    const avatar = document.getElementById('avatar');
    avatar.src = `../assets/meeples/${user.meep}`;
    //const userTiles = document.getElementById('tile-count-span');
   // userTiles.textContent = user.meep;
}
// Render full game board in targeted element
renderGameBoard(resultsBoard);

// Build play again button
const playAgainButton = document.getElementById('play-again-button');
playAgainButton.addEventListener('click', () => {
    location.href = '/';
});
