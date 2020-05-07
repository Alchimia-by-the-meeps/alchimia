//import { maxRows, maxColumns } from '../game-board/game-board.js';
import { getUser, renderGameBoard } from '../utils/api.js';
import { renderResultsScore } from '../utils/scoring.js';


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

// Render score in targeted element
renderResultsScore();

// Render full game board in targeted element
renderGameBoard(resultsBoard);

// Build play again button
const playAgainButton = document.getElementById('play-again-button');
playAgainButton.addEventListener('click', () => {
    location.href = '../';
});
