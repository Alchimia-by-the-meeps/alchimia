// event listener on both buttons
// on click transform the image per button selection (left/right)
    // on rotation, need to update the sides [0, 1, 2, 3]
    // get the current rotation 
// cool function! it seems like there are only a few differences between left and right, so maybe this refactor would make sense . . .
//import function to game-board (only call in gameboard)
export function rotateTile(tileToRotate, direction) {
    const getPlayerTile = document.getElementById('player-tile');
    // const tileToRotate = topDeckTile; // does this need to be redeclared?

    if (direction === 'right') {
        tileToRotate.sides.unshift(tileToRotate.sides.pop());

    } else { // does this need the else if?
        tileToRotate.sides.push(tileToRotate.sides.shift());
    } 

    tileToRotate.rotation = direction === 'right' 
        ? tileToRotate.rotation + 90
        : tileToRotate.rotation - 90;

    getPlayerTile.style.transform = 'rotate(' + tileToRotate.rotation + 'deg)';
    getPlayerTile.style.transition = '.3s';
    
    return tileToRotate;
}