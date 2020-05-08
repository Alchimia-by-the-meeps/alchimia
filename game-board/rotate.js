// event listener on both buttons
// on click transform the image per button selection (left/right)
    // on rotation, need to update the sides [0, 1, 2, 3]
    // get the current rotation 

//import function to game-board (only call in gameboard)
export function rotateTile(topDeckTile, direction) {
    const getPlayerTile = document.getElementById('player-tile');
    const tileToRotate = topDeckTile;
    if (direction === 'right') {
        tileToRotate.sides.unshift(tileToRotate.sides.pop());
        if (tileToRotate.cities) tileToRotate.cities.unshift(tileToRotate.cities.pop());
        tileToRotate.rotation = tileToRotate.rotation + 90;
        getPlayerTile.style.transform = 'rotate(' + tileToRotate.rotation + 'deg)';
        getPlayerTile.style.transition = '.3s';

    } else if (direction === 'left') {
        tileToRotate.sides.push(tileToRotate.sides.shift());
        if (tileToRotate.cities) tileToRotate.cities.push(tileToRotate.cities.shift());
        tileToRotate.rotation = tileToRotate.rotation - 90;
        getPlayerTile.style.transform = 'rotate(' + tileToRotate.rotation + 'deg)';
        getPlayerTile.style.transition = '.3s';
    } 
    return tileToRotate;
}