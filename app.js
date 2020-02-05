import { saveUser } from './utils/api.js';
import makeUser from './utils/make-user.js';
import { tiles } from './data/tiles.js';

//grab our form from home page so we can access on submit
const userSignUp = document.getElementById('user-sign-up');
//add event listener for when form is submitted
userSignUp.addEventListener('submit', function(event) {
    event.preventDefault();
    //create new formData
    const formData = new FormData(userSignUp);
    //use form data to make user
    const user = makeUser(formData);
    //save user in local storage
    saveUser(user);

    initializeGameState();

    //send to game-board page to start adventure
    window.location = 'game-board';
        
});

const riverTiles = tiles;

function initializeGameState() {
    
    const maxColumns = 12;
    const maxRows = 8;
    let gameState = [];

    for (let i = 0; i < maxRows; i++) {
        //make new array for every row in grid array
        gameState.push(new Array());
        //make null placeholder for each cell in grid
        for (let j = 0; j < maxColumns; j++) {
            gameState[i].push(null);
        }
    } 

    gameState[2][3] = riverTiles['73'].id;
    gameState[2][4] = riverTiles['74'].id;
    gameState[2][5] = riverTiles['76'].id;
    gameState[3][5] = riverTiles['77'].id;
    gameState[4][5] = riverTiles['83'].id;
    gameState[5][5] = riverTiles['79'].id;
    gameState[5][6] = riverTiles['81'].id;
    gameState[5][7] = riverTiles['84'].id;
   
    const stringyGameState = JSON.stringify(gameState);
    localStorage.setItem('gameState', stringyGameState);
}


// riverArray = [0, 1, 2, '7-rotated', '8-rotated', '4-rotated', 6, 9];

// gameState[row][column] = topDeckTile.id;
// // console.log(gameState);
// updateGameState(gameState);
// //if tile already has background image, do not run
// if (currentTile.style.backgroundImage) return;
