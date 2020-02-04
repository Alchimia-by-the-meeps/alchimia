import { saveUser } from './utils/api.js';
import makeUser from './utils/make-user.js';

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
    gameState = JSON.stringify(gameState);
    localStorage.setItem('gameState', gameState);
}

