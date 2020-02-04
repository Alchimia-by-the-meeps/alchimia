//Login page

//set up link in "by the meeps" to meet-the-meeps-page

//get username and meeple from form

    //push that to local storage

//on submit pop up instructions and "play game" button
import { saveUser } from './api.js';
import makeUser from './make-user.js';

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
    //send to game-board page to start adventure
    window.location = 'game-board';
        
});