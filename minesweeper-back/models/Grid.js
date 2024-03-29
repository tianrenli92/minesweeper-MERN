const GameStatus = require('./GameStatus');
const Square = require('./Square');
const Tag = require('./Tag');

class Grid {
    constructor(height, width, mines) {
        this.height = height;
        this.width = width;
        this.mines = mines;
        this.squares = height * width;
        this.unrevealedSafeSquares = this.squares - this.mines;
        this.untaggedMines = mines;
        this.gameStatus = GameStatus.ONGOING;
        this.tagMap = this.generateTagMap(height, width);
        this.firstReveal = false;
        this.mineMap = this.generateEmptyMineMap(height, width);
    }

    generateTagMap(height, width) {
        let tagMap = [];
        for (let i = 0; i < height + 2; i++) {
            let row = [];
            for (let j = 0; j < width + 2; j++) {
                row.push(Tag.UNREVEALED);
            }
            tagMap.push(row);
        }
        return tagMap;
    }

    generateEmptyMineMap(height, width) {
        // frame mineMap
        let mineMap = [];
        for (let i = 0; i < height + 2; i++) {
            let row = [];
            for (let j = 0; j < width + 2; j++) {
                row.push(Square.MAP_FRAME);
            }
            mineMap.push(row);
        }
        for (let i = 1; i <= height; i++) {
            for (let j = 1; j <= width; j++) {
                mineMap[i][j] = 0;
            }
        }
        return mineMap;
    }

    reveal(x, y) {
        // validate
        if (this.gameStatus != GameStatus.ONGOING)
            return;
        if (this.tagMap[x][y] != Tag.UNREVEALED)
            return;
        // reveal square
        this.tagMap[x][y] = Tag.REVEALED;
        // check if firstReveal
        if (!this.firstReveal) {
            this.generateMines(x, y);
            this.firstReveal = true;
        }
        // check mine
        if (this.mineMap[x][y] == Square.MAP_MINE) {
            this.gameStatus = GameStatus.LOSE;
            this.show();
            return;
        }
        this.unrevealedSafeSquares--;
        // if there is no adjacent mine, reveal nearby safe area
        if (this.mineMap[x][y] == 0) {
            let qx = [];
            let qy = [];
            let xx, xxx, yy, yyy;
            qx.push(x);
            qy.push(y);
            while (qx.length != 0) {
                xx = qx.shift();
                yy = qy.shift();
                for (let dx = -1; dx <= 1; dx++)
                    for (let dy = -1; dy <= 1; dy++) {
                        xxx = xx + dx;
                        yyy = yy + dy;
                        if (this.mineMap[xxx][yyy] == Square.MAP_FRAME || this.tagMap[xxx][yyy] != Tag.UNREVEALED)
                            continue;
                        this.tagMap[xxx][yyy] = Tag.REVEALED;
                        this.unrevealedSafeSquares--;
                        if (this.mineMap[xxx][yyy] == 0) {
                            qx.push(xxx);
                            qy.push(yyy);
                        }
                    }
            }
        }
        this.checkWin();
        this.show();
    }

    generateMines(firstX, firstY) {
        let mineMap = this.mineMap;
        let height = this.height;
        let width = this.width;
        let squares = this.squares;
        let mines = this.mines;

        // randomly generate mines
        let safeSquares = squares - mines;
        for (let i = 1; i <= height; i++) {
            for (let j = 1; j <= width; j++) {
                let rand = this.randomInt(squares);
                if (rand < mines) {
                    mineMap[i][j] = Square.MAP_MINE;
                    mines--;
                } else {
                    mineMap[i][j] = 0;
                }
                squares--;
            }
        }
        // promise first reveal is not mine
        if (mineMap[firstX][firstY] == Square.MAP_MINE) {
            this.swapSafeSquare(mineMap, height, width, safeSquares, firstX, firstY);
        }
        // generate adjacent mine count
        let s;
        for (let i = 1; i <= height; i++) {
            for (let j = 1; j <= width; j++) {
                if (mineMap[i][j] == Square.MAP_MINE)
                    continue;
                s = 0;
                for (let di = -1; di <= 1; di++)
                    for (let dj = -1; dj <= 1; dj++)
                        if (mineMap[i + di][j + dj] == Square.MAP_MINE)
                            s++;
                mineMap[i][j] = s;
            }
        }
        // print mineMap
        console.log('Mine map:');
        mineMap.forEach((row)=>{
            console.log(row);
        });
    }

    randomInt(x) {
        return Math.floor(Math.random() * x);
    }

    swapSafeSquare(mineMap, height, width, safeSquares, firstX, firstY) {
        // randomly select a safe square and swap it with the first reveal
        let rand;
        for (let i = 1; i <= height; i++)
            for (let j = 1; j <= width; j++)
                if (mineMap[i][j] == 0) {
                    rand = this.randomInt(safeSquares);
                    if (rand == 0) {
                        // swap mine and safe square
                        mineMap[i][j] = Square.MAP_MINE;
                        mineMap[firstX][firstY] = 0;
                        return;
                    }
                    safeSquares--;
                }
    }

    checkWin() {
        if (this.unrevealedSafeSquares == 0) {
            this.gameStatus = GameStatus.WIN;
            // tag all mines
            for (let i = 1; i <= this.height; i++)
                for (let j = 1; j <= this.width; j++)
                    if (this.tagMap[i][j] == Tag.UNREVEALED)
                        this.tagMap[i][j] = Tag.TAGGED;
            this.untaggedMines = 0;
        }
    }

    tag(x, y) {
        // validate
        if (this.gameStatus != GameStatus.ONGOING)
            return;
        if (this.tagMap[x][y] == Tag.REVEALED)
            return;
        // rotation of unrevealed, tagged, and questioned
        if (this.tagMap[x][y] == Tag.UNREVEALED) {
            this.tagMap[x][y] = Tag.TAGGED;
            this.untaggedMines--;
            this.checkWin();
        } else if (this.tagMap[x][y] == Tag.TAGGED) {
            this.tagMap[x][y] = Tag.QUESTIONED;
            this.untaggedMines++;
        } else if (this.tagMap[x][y] == Tag.QUESTIONED) {
            this.tagMap[x][y] = Tag.UNREVEALED;
        }
        this.show();
    }

    quickClear(x, y) {
        // validate
        if (this.gameStatus != GameStatus.ONGOING)
            return;
        if (this.tagMap[x][y] != Tag.REVEALED)
            return;
        // check if nearby mines are all tagged
        let unrevealedMines = this.mineMap[x][y];
        let xx, yy;
        for (let dx = -1; dx <= 1; dx++)
            for (let dy = -1; dy <= 1; dy++) {
                xx = x + dx;
                yy = y + dy;
                if (this.tagMap[xx][yy] == Tag.TAGGED)
                    unrevealedMines--;
            }
        if (unrevealedMines != 0)
            return;
        // reveal possibly safe squares
        for (let dx = -1; dx <= 1; dx++)
            for (let dy = -1; dy <= 1; dy++) {
                xx = x + dx;
                yy = y + dy;
                if (this.mineMap[xx][yy] != Square.MAP_FRAME && this.tagMap[xx][yy] == Tag.UNREVEALED)
                    this.reveal(xx, yy);
            }
        this.show();
    }

    replay() {
        this.unrevealedSafeSquares = this.squares - this.mines;
        this.untaggedMines = this.mines;
        this.gameStatus = GameStatus.ONGOING;
        this.tagMap = this.generateTagMap(this.height, this.width);
        this.show()
    }

    show() {
        console.log(`Mines left: ${this.untaggedMines}`)
        console.log(`Squares left: ${this.unrevealedSafeSquares}`)
        if (this.gameStatus == GameStatus.ONGOING)
            console.log(`Status: ONGOING`);
        else if (this.gameStatus == GameStatus.LOSE)
            console.log(`Status: LOSE`);
        else if (this.gameStatus == GameStatus.WIN)
            console.log(`Status: WIN`);
        let clientMap = this.getClientMap();
        clientMap.forEach((row) => {
            row.forEach((square) => {
                process.stdout.write(square);
            });
            process.stdout.write('\n');
        });
    }

    getClientMap() {
        let clientMap = [];
        for (let i = 0; i < this.height + 2; i++) {
            let row = [];
            for (let j = 0; j < this.width + 2; j++) {
                if (this.mineMap[i][j] == Square.MAP_FRAME)
                    row.push('#');
                else if (this.tagMap[i][j] == Tag.UNREVEALED)
                    row.push(' ');
                else if (this.tagMap[i][j] == Tag.TAGGED)
                    row.push('F');
                else if (this.tagMap[i][j] == Tag.QUESTIONED)
                    row.push('?');
                // else it is revealed
                else if (this.mineMap[i][j] == Square.MAP_MINE)
                    row.push('X');
                // else show nearby mine count
                else
                    row.push(this.mineMap[i][j].toString());
            }
            clientMap.push(row);
        }
        return clientMap;
    }

    getClientGame() {
        return {
            height: this.height,
            width: this.width,
            mines: this.mines,
            squares: this.squares,
            unrevealedSafeSquares: this.unrevealedSafeSquares,
            untaggedMines: this.untaggedMines,
            gameStatus: this.gameStatus,
            clientMap: this.getClientMap(),
        }
    }
}

module.exports = Grid;
