const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST request to /api/solve tests', () => {

    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
      const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      const solution = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzle, row: 0, col: 0 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'solution'); 
          assert.equal(res.body.solution, solution);
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
      chai.request(server)
        .post('/api/solve')
        .send({ row: 0, col: 0 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error'); 
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
      const puzzle = '5..91372.3...8.5.9.9.G5..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzle, row: 0, col: 0 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error'); 
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
      const puzzle = '5..91372.3...8.5.9.5..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzle, row: 0, col: 0 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error'); 
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
      const puzzle = '5..95372.3...8.5.9.9.35..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzle, row: 0, col: 0 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error'); 
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });

  suite('POST request to /api/check tests', () => {

    test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'E4', value: 5 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'valid');
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'E4', value: 4 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'conflict');
          assert.property(res.body, 'valid');
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict, 'column');
          done();
        });
    });

    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'E5', value: 9 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'conflict');
          assert.property(res.body, 'valid');
          assert.equal(res.body.valid, false);
          assert.deepEqual(res.body.conflict, [ 'row', 'region' ]);
          done();
        });
    });

    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'E6', value: 9 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'conflict');
          assert.property(res.body, 'valid');
          assert.equal(res.body.valid, false);
          assert.deepEqual(res.body.conflict, [ 'column', 'row', 'region' ]);
          done(); 
        });
    });

    test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'E6' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.deepEqual(res.body.error, 'Required field(s) missing');
          done(); 
        });
    });

    test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
      const puzzle = '..9..5.1.85.4....2A32......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'E4', value: 5 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.deepEqual(res.body.error, 'Invalid characters in puzzle');
          done(); 
        });
    });

    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
      const puzzle = '..9..5.1.85.4....232......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'E4', value: 5 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.deepEqual(res.body.error, 'Expected puzzle to be 81 characters long');
          done(); 
        });
    });
    
    test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'EA', value: 5 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.deepEqual(res.body.error, 'Invalid coordinate');
          done(); 
        });
    });

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
      const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: puzzle, coordinate: 'E4', value: 11 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'error');
          assert.deepEqual(res.body.error, 'Invalid value');
          done(); 
        });
    });


  });
});

