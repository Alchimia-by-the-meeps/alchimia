// IMPORT MODULES under test here:
// import example from '../src/example.js';
import { getPlacedTiles, getUnplayedTiles, makeBlankGameState } from './functionstotest.js';
const test = QUnit.test;

test('get all placed tiles from grid', function(assert) {
    const input = 
    [[null, null, null, 27, null],
        [null, 12, 15, 82, 1552341],
        [1, 2, 3, 4, 5],
        [null, null, null, null]];

    const expected = 
    [27, 12, 15, 82, 1552341, 1, 2, 3, 4, 5];
    

    assert.deepEqual(getPlacedTiles(input), expected);
});
