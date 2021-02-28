'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      return res.json(solver.checkPlacement(req.body.puzzle, req.body.coordinate, req.body.value))
    });

  app.route('/api/solve')
    .post((req, res) => {
      return res.json(solver.solve(req.body.puzzle, 0, 0));
    });
};
