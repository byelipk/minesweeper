const readline = require('readline');

class MineSweeper {
  constructor() {
    this.gameBoard   = [];
    this.playerBoard = [];

    // Beginner level games have 9 sides and 10 mines
    this.sides = 9;
    this.mines = 10;
    this.madeFirstMove = false;

    this._initialize();
    this._placeMines();
  }

  _initialize() {
    for (let i = 0; i < this.sides; i++) {
      this.playerBoard[i] = [];
      this.gameBoard[i]   = [];
      for (let j = 0; j < this.sides; j++) {
        this.gameBoard[i][j]   = '-';
        this.playerBoard[i][j] = '-';
      }
    }
  }

  _getRandomCell() {
    let randX = this._getRandomInt(0, this.sides - 1);
    let randY = this._getRandomInt(0, this.sides - 1);
    return [randX, randY];
  }

  _getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  _placeMines() {
    let i = 0;
    while (i < this.mines) {
      let cell = this._getRandomCell();

      if (this.gameBoard[cell[0]][cell[1]] !== "*") {
        this.gameBoard[cell[0]][cell[1]] = "*";
        i++;
      }
    }
  }

  _isValidCell(row, col) {
    return row >= 0 && row < this.sides &&
           col >= 0 && col < this.sides;
  }

  _isMine(row, col) {
    return this.gameBoard[row][col] === "*";
  }

  /*
    Count all the mines in the 8 adjacent
    cells

        N.W   N   N.E
          \   |   /
           \  |  /
        W----Cell----E
             / | \
           /   |  \
        S.W    S   S.E

    Cell-->Current Cell (row, col)
    N -->  North        (row-1, col)
    S -->  South        (row+1, col)
    E -->  East         (row, col+1)
    W -->  West         (row, col-1)
    N.E--> North-East   (row-1, col+1)
    N.W--> North-West   (row-1, col-1)
    S.E--> South-East   (row+1, col+1)
    S.W--> South-West   (row+1, col-1)
  **/
  _countAjacentMines(row, col) {
    let count = 0;

    // Current
    if (this._isValidCell(row, col) && this._isMine(row, col))
      count++;

    // North
    if (this._isValidCell(row-1, col) && this._isMine(row-1, col))
      count++;

    // South
    if (this._isValidCell(row+1, col) && this._isMine(row+1, col))
      count++;

    // East
    if (this._isValidCell(row, col+1) && this._isMine(row, col+1))
      count++;

    // West
    if (this._isValidCell(row, col-1) && this._isMine(row, col-1))
      count++;

    // North-East
    if (this._isValidCell(row-1, col+1) && this._isMine(row-1, col+1))
      count++;

    // North-West
    if (this._isValidCell(row-1, col-1) && this._isMine(row-1, col-1))
      count++;

    // South-East
    if (this._isValidCell(row+1, col+1) && this._isMine(row+1, col+1))
      count++;

    // South-West
    if (this._isValidCell(row+1, col-1) && this._isMine(row+1, col-1))
      count++;

    return count;
  }

  print(board) {
    console.log();
    console.log("The Game");
    console.log("--------");
    console.log();

    let output = "";

    for (var i = 0; i < this.sides; i++) {
      for (var j = 0; j < this.sides; j++) {
        output = output.concat(`${board[i][j]} `);
      }
      output = output.concat("\n");
    }

    console.log(output);
  }

  _replaceMine(row, col, symbol) {
    this.gameBoard[row][col] = symbol;

    let swapped = false;

    while (!swapped) {
      let cell = this._getRandomCell();

      if (this.gameBoard[cell[0]][cell[1]] === '-') {
        this.gameBoard[cell[0]][cell[1]] = "*";
        swapped = true;
      }
    }
  }

  _parse(line) {
    let row, col;

    [row, col] = line.split(' ');

    return [parseInt(row, 10), parseInt(col, 10)];
  }

  _recurse(row, col, rl) {
    // Base case for recursion.
    //
    // We'll never hit the base case on the first move
    // because we're guarding against stepping on a mine
    // on the first move.
    //
    // We'll only run into the base case when we step on
    // a cell with a number label which reveals how many
    // nearby mines there are.
    if (this.playerBoard[row][col] !== "-") {
      return false;
    }

    if (this.gameBoard[row][col] === "*") {
      this.playerBoard[row][col] = "*";
      console.log("STEPPED ON A MINE: GAME OVER");
      this.print(this.playerBoard);
      return true;
    }

    else {
      // Count the number of adjacent mines for this cell
      let count = this._countAjacentMines(row, col);

      this.playerBoard[row][col] = `${count}`;


      if (count === 0) {
        // Now do the recursion

        // North
        if (this._isValidCell(row-1, col) && !this._isMine(row-1, col)) {
          this._recurse(row-1, col, rl);
        }

        // South
        if (this._isValidCell(row+1, col) && !this._isMine(row+1, col)) {
          this._recurse(row+1, col, rl);
        }

        // East
        if (this._isValidCell(row, col+1) && !this._isMine(row, col+1)) {
          this._recurse(row, col+1, rl);
        }

        // West
        if (this._isValidCell(row, col-1) && !this._isMine(row, col-1)) {
          this._recurse(row, col-1, rl);
        }

        // North-East
        if (this._isValidCell(row-1, col+1) && !this._isMine(row-1, col+1)) {
          this._recurse(row-1, col+1, rl);
        }

        // North-West
        if (this._isValidCell(row-1, col-1) && !this._isMine(row-1, col-1)) {
          this._recurse(row-1, col-1, rl);
        }

        // South-East
        if (this._isValidCell(row+1, col+1) && !this._isMine(row+1, col+1)) {
          this._recurse(row+1, col+1, rl);
        }

        // South-West
        if (this._isValidCell(row+1, col-1) && !this._isMine(row+1, col-1)) {
          this._recurse(row+1, col-1, rl);
        }
      }
    }
  }

  _processLine(line, movesCount, rl) {
    let row, col;

    [row, col] = this._parse(line);

    if (!this.madeFirstMove) {
      console.log("Made first move");
      this.madeFirstMove = true;
      // If a player steps on a mine on their first move,
      // we replace the mine with a safe cell, and move
      // the mine to another cell.
      if (this._isMine(row, col)) {
        this._replaceMine(row, col, "-");
      }
    }

    let gameOver = this._recurse(row, col, rl);

    if (gameOver) {
      rl.close();
    }
    else {
      this.print(this.playerBoard);
      this.print(this.gameBoard);
      console.log();
      console.log("Make your guess (row, col): ");
      rl.prompt();
    }
  }

  play() {
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    let movesCount = 0;


    rl.on("line", (line) => {
      if (line.match(/^[0-8]\s[0-8]/)) {
        this._processLine(line, this.madeFirstMove, rl);
      }
      else {
        console.log("Valid (row, col) are between 0 and 8. ☺️");
        rl.prompt();
      }
    })
    .on("close", () => {
      process.exit(1);
    });

    console.log("Make your guess (row, col): ");
    rl.prompt();

  }
}

const game = new MineSweeper();

game.play();
