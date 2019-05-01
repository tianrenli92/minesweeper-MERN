const express = require('express');
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/TicTacToe";
const router = express.Router();
const Game = require('../models/Game')
const Grid = require('../models/Grid')
const GameEvent = require('../models/GameEvent')

/* post a new game */
router.post('/', (req, res) => {
    let {height, width, mines} = req.body;
    let grid = new Grid(height, width, mines);
    let game = new Game(grid);
    game.createTime = game.editTime = Date.now();
    game.save().then((game)=>{
        res.json({gameId: game.id});
    });
    mongoose.connect(url, {useNewUrlParser: true}).then();
});

/* get games info */
router.get('/', (req, res) => {
    Game.find({}).sort('-editTime').then((games)=>{
        let gameInfos = [];
        games.forEach((game)=>{
            gameInfos.push({
                gameId: game._id,
                createTime: game.createTime,
                editTime: game.editTime,
                height: game.height,
                width: game.width,
                mines: game.mines,
                unrevealedSafeSquares: game.unrevealedSafeSquares,
                untaggedMines: game.untaggedMines,
                gameStatus: game.gameStatus,
            });
        })
        res.json(gameInfos);
    });
    mongoose.connect(url, {useNewUrlParser: true}).then();
});

/* get a game */
router.get('/:gameId', (req, res) => {
    let {gameId} = req.params;
    let clientGame;
    Game.findById(gameId).then((game) => {
        clientGame = game.getClientGame();
        res.json(clientGame);
    })
    mongoose.connect(url, {useNewUrlParser: true}).then();
});

/* update a game */
router.put('/:gameId', (req, res) => {
    let {gameId} = req.params;
    let {gameEvent, x, y} = req.body;
    let clientGame;
    Game.findById(gameId).then((game) => {
        switch (gameEvent) {
            case GameEvent.REVEAL:
                game.reveal(x, y);
                break;
            case GameEvent.TAG:
                game.tag(x, y);
                break;
            case GameEvent.QUICK_CLEAR:
                game.quickClear(x, y);
                break;
            case GameEvent.REPLAY:
                game.replay();
                break;
        }
        game.editTime = Date.now();
        game.markModified('tagMap');
        game.markModified('editTime');
        game.save();
        clientGame = game.getClientGame();
        res.json(clientGame);
    })
    mongoose.connect(url, {useNewUrlParser: true}).then();
});

/* delete a game */
router.delete('/:gameId', (req, res) => {
    let {gameId} = req.params;
    Game.deleteOne({_id: gameId}).then(() => {
        res.json({});
    })
    mongoose.connect(url, {useNewUrlParser: true}).then();
});

module.exports = router;
