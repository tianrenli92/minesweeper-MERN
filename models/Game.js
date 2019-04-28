const mongoose = require('mongoose');
const GameStatus = require('GameStatus')
const Grid = require('Grid')
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    height: Number,
    width: Number,
    mines: Number,
    squares: Number,
    unrevealedSafeSquares: Number,
    untaggedMines: Number,
    gameStatus: Number,
    tagMap: [[Number]],
    firstReveal: Boolean,
    mineMap: [[Number]],
})


const Game = mongoose.model('Game', gameSchema);
