import { initializeGameState, initializePlacedTiles, addRiverToPlacedTiles } from './utils/api.js';
import { saveUser, makeUser } from './utils/user-stuff.js';

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
    initializePlacedTiles();
    addRiverToPlacedTiles();

    //send to game-board page to start adventure
    window.location = 'game-board';
        
});