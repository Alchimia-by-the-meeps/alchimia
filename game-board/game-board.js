// create grid, 12 by 8
    // dynamically create 8 sections (rows)
    // Fill with 12 cells (columns)
    // Each cell has an id
    // Each cell has a class
    // Grid give an event listener

const grid = document.getElementById('grid');

export function renderRow() {

    const maxColumns = 12;
    const maxRows = 8;

    for (let i = 0; i < maxRows; i++) {
        const row = document.createElement('section');
        row.id = `row-${i}`;
        row.classList.add('row');

        for (let j = 0; j < maxColumns; j++) {
            const cell = document.createElement('div');
            cell.id = `grid-${i}-${j}`;
            cell.classList.add('cell');
            row.appendChild(cell);
        }
        grid.appendChild(row);
    }

}  

renderRow();

// place starting river tiles ~8

// import the tiles

// create deck / get tile function 

// on click, get grid space id and place tile

// save game state

// generate new tile from 'deck'

//end game button

// 


    const div = document.getElementById('grid-0-6');
    div.style.opacity = 1;
    div.style.background = 'url("../common/CastleCenter0.png")';
    div.style.backgroundSize = 'cover';
    // container.appendChild(div);