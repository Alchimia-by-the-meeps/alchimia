
// event listener on both buttons
// on click transform the image per button selection (left/right)
    // on rotation, need to update the sides [0, 1, 2, 3]
    // get the current rotation 

const rightButton = document.getElementById('rotate-right');
const leftButton = document.getElementById('rotate-left');
const getPlayerTile = document.getElementById('player-tile');


//import function to game-board (only call in gameboard)
export function rotateTile(topDeckTile, direction) {
    const tileToRotate = topDeckTile;
    if (direction === 'right') {
        tileToRotate.sides.unshift(tileToRotate.sides.pop());
        tileToRotate.rotation = tileToRotate.rotation + 90;
        getPlayerTile.style.transform = 'rotate(' + tileToRotate.rotation + 'deg)';

    } else if (direction === 'left') {
        tileToRotate.sides.push(tileToRotate.sides.shift());
        tileToRotate.rotation = tileToRotate.rotation - 90;
        getPlayerTile.style.transform = 'rotate(' + tileToRotate.rotation + 'deg)';
    } 
    return tileToRotate;
}

// game board JS
// rightButton.addEventListener('click', () => {
//     topDeckTile = rotateTile(topDeckTile, 'right');
// });

// leftButton.addEventListener('click', () => {
//     topDeckTile = rotateTile(topDeckTile, 'left');
// });