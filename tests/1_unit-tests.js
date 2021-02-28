const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
  test('Logic handles a valid puzzle string of 81 characters', (done) => {
    const input = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
    const output = '827549163531672894649831527496157382218396475753284916962415738185763249374928651';
    assert.isTrue(solver.validate(input));
    assert.equal(solver.solve(input, 0, 0).solution, output);
    done();
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
    const input = '82..4..6...16..89...98G15.749.157.............53..4...96.415..81..7632..3...28.51';
    assert.isNotTrue(solver.validate(input));
    assert.deepEqual(solver.solve(input, 0, 0), { error: 'Invalid characters in puzzle' });
    done();
  });

  test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
    const input = '82..4..6...16..89...9815.749.157.............53..4...96.415..81..7632..3...28.51';
    assert.isNotTrue(solver.validate(input));
    assert.deepEqual(solver.solve(input, 0, 0), { error: 'Expected puzzle to be 81 characters long' });
    done();
  });

  test('Logic handles a valid row placement', (done) => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const board = solver.createBoard(puzzle);
    const row = 4;
    const col = 3;
    const value = 5;
    assert.isTrue(solver.validate(puzzle));
    assert.deepEqual(solver.checkRowPlacement(board, row, col, value), { valid: true });
    done();
  });

  test('Logic handles an invalid row placement', (done) => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const board = solver.createBoard(puzzle);
    const row = 1;
    const col = 2;
    const value = 5;
    assert.isTrue(solver.validate(puzzle));
    assert.deepEqual(solver.checkRowPlacement(board, row, col, value), { valid: false, conflict: 'row' });
    done();
  });

  test('Logic handles a valid column placement', (done) => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const board = solver.createBoard(puzzle);
    const row = 4;
    const col = 3;
    const value = 5;
    assert.isTrue(solver.validate(puzzle));
    assert.deepEqual(solver.checkColPlacement(board, row, col, value), { valid: true });
    done();
  });

  test('Logic handles an invalid column placement', (done) => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const board = solver.createBoard(puzzle);
    const row = 4;
    const col = 3;
    const value = 7;
    assert.isTrue(solver.validate(puzzle));
    assert.deepEqual(solver.checkColPlacement(board, row, col, value), { valid: false, conflict: 'column' });
    done();
  });

  test('Logic handles a valid region (3x3 grid) placement', (done) => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const board = solver.createBoard(puzzle);
    const row = 4;
    const col = 3;
    const value = 5;
    assert.isTrue(solver.validate(puzzle));
    assert.deepEqual(solver.checkRegionPlacement(board, row, col, value), { valid: true });
    done();
  });

  test('Logic handles an invalid region (3x3 grid) placement', (done) => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const board = solver.createBoard(puzzle);
    const row = 4;
    const col = 3;
    const value = 7;
    assert.isTrue(solver.validate(puzzle));
    assert.deepEqual(solver.checkRegionPlacement(board, row, col, value), { valid: false, conflict: 'region' });
    done();
  });

  test('Valid puzzle strings pass the solver', (done) => {
    const puzzle = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51';
    const solution = '827549163531672894649831527496157382218396475753284916962415738185763249374928651';
    assert.isTrue(solver.validate(puzzle));
    assert.deepEqual(solver.solve(puzzle, 0, 0), { solution: solution }); 
    done();
  });

  test('Invalid puzzle strings fail the solver', (done) => {
    const puzzle = '..9..5.1.8434....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    assert.deepEqual(solver.solve(puzzle, 0, 0), { error: 'Puzzle cannot be solved' }); 
    done();
  });

  test('Solver returns the the expected solution for an incomplete puzzzle', (done) => {
    const puzzle = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1';
    const solution = '218396745753284196496157832531672984649831257827549613962415378185763429374928561';
    assert.isTrue(solver.validate(puzzle));
    assert.deepEqual(solver.solve(puzzle, 0, 0), { solution: solution }); 
    done();
  });
});
