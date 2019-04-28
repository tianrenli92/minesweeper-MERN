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
    game.save().then((game)=>{
        res.json({id: game.id});
    });
    mongoose.connect(url, {useNewUrlParser: true}).then();
});

/* get games */
router.get('/', (req, res) => {

    mongoose.connect(url, {useNewUrlParser: true}).then(
        () => {
            res.json({id: game.id});
        });
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
        game.markModified('tagMap');
        game.save();
        clientGame = game.getClientGame();
        res.json(clientGame);
    })
    mongoose.connect(url, {useNewUrlParser: true}).then();
});

module.exports = router;
