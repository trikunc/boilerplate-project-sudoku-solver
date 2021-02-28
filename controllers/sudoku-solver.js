class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length != 81) {
      return { error: 'Expected puzzle to be 81 characters long' }
    }
    if (!/^[0-9.]*$/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    return true;
  }

  checkRowPlacement(board, row, column, value) {
    if (board[row][column] != '.') {
      return { valid: false, conflict: 'row' };
    }
    for (let i = 0; i < 9; i++) {
      if (board[row][i] == value) {
        return { valid: false, conflict: 'row' }
      }
    }
    return { valid: true }
  }

  checkColPlacement(board, row, column, value) {
    if (board[row][column] != '.') {
      return { valid: false, conflict: 'column' };
    }
    for (let i = 0; i < 9; i++) {
      if (board[i][column] == value) {
        return { valid: false, conflict: 'column' }
      }
    }
    return { valid: true }
  }

  checkRegionPlacement(board, row, column, value) {
    if (board[row][column] != '.') {
      return { valid: false, conflict: 'region' }
    }
    let regionStartRow = parseInt(row / 3) * 3;
    let regionStartCol = parseInt(column / 3) * 3;
    for (let i = regionStartRow; i < regionStartRow + 3; i++) {
      for (let j = regionStartCol; j < regionStartCol + 3; j++) {
        if (board[i][j] == value) {
          return { valid: false, conflict: 'region' }
        }
      }
    }
    return { valid: true }
  }

  solve(board, row, col) {
    if (!board) {
      return { error: 'Required field missing' };
    }
    if (!Array.isArray(board)) {
      if (this.validate(board).error) {
        return { error: this.validate(board).error }
      }
      board = this.createBoard(board);
    }
    if (col === 9) {
      col = 0;
      row++;
    }
    if (row === 9) {
      return { solution: board.join('') };
    }
    if (board[row][col] != '.') {
      return this.solve(board, row, (col + 1));
    }
    let coord = this.rowColToCoord(row, col);
    for (let i = 1; i < 10; i++) {
      if (this.checkPlacement(board, coord, i).valid == true) {
        board[row][col] = i;
        if (!this.solve(board, row, (col + 1)).error) {
          board = board.join('').replace(/,/g, '');
          return { solution: board };
        } else {
          board[row][col] = '.';
        }
      }
    }
    return { error: 'Puzzle cannot be solved' };
  }

  createBoard(values) {
    let puzzleBoard = [[], [], [], [], [], [], [], [], []];
    let row = -1;
    values = values.split('');
    for (let i = 0; i < values.length; i++) {
      if (i % 9 === 0) {
        row++;
      }
      puzzleBoard[row].push(values[i]);
    }
    return puzzleBoard;
  }

  rowColToCoord(row, col) {
    let rows = {
      '0': 'A',
      '1': 'B',
      '2': 'C',
      '3': 'D',
      '4': 'E',
      '5': 'F',
      '6': 'G',
      '7': 'H',
      '8': 'I'
    }
    return rows[row] + (col + 1);
  }

  coordToRowCol(coord) {
    let rows = {
      'A': '0',
      'B': '1',
      'C': '2',
      'D': '3',
      'E': '4',
      'F': '5',
      'G': '6',
      'H': '7',
      'I': '8'
    }
    if (!/[A-I]/.test(coord.slice(0, 1)) || !(coord.slice(1) > 0 && coord.slice(1) < 10)) {
      return { error: 'Invalid coordinate' };
    }
    return [rows[coord.slice(0, 1)], parseInt(coord.slice(1)) - 1];
  }

  checkPlacement(puzzleString, coord, value) {
    if (!puzzleString || !coord || !value) {
      return { error: 'Required field(s) missing' };
    }

    let board;
    if (Array.isArray(puzzleString)) {
      board = puzzleString;
    } else {
      if (this.validate(puzzleString).error) {
        return { error: this.validate(puzzleString).error }
      }
      board = this.createBoard(puzzleString);
    }
    if (isNaN(value) || value < 1 || value > 9) {
      return { error: 'Invalid value' };
    }

    let rowCol = this.coordToRowCol(coord);
    if (rowCol.error) {
      return { error: rowCol.error };
    }

    let row = rowCol[0];
    let col = rowCol[1];
    let conflicts = []

    if (this.checkColPlacement(board, row, col, value).valid != true) {
      conflicts.push(this.checkColPlacement(board, row, col, value).conflict);
    }
    if (this.checkRowPlacement(board, row, col, value).valid != true) {
      conflicts.push(this.checkRowPlacement(board, row, col, value).conflict);
    }
    if (this.checkRegionPlacement(board, row, col, value).valid != true) {
      conflicts.push(this.checkRegionPlacement(board, row, col, value).conflict);
    }
    if (conflicts.length > 0) {
      return { valid: false, conflict: conflicts };
    }
    return { valid: true };
  }
}

module.exports = SudokuSolver;


