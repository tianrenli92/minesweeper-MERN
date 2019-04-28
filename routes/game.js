const express = require('express');
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/TicTacToe";
const router = express.Router();
const Game = require('../models/Game')
const Grid = require('../models/Grid')
const GameEvent = require('../models/GameEvent')

/* post a new game. */
router.post('/', (req, res) => {
    let {height, width, mines} = req.body;
    let grid = new Grid(height, width, mines);
    let game = new Game(grid);
    game.save();
    mongoose.connect(url, {useNewUrlParser: true}).then(
        () => {
            res.json({id: game.id});
        });
});

router.put('/:gameId', (req, res) => {
    let {gameId} = req.params;
    let {gameEvent, x, y} = req.body;
    let gameLog;
    Game.findById(gameId).then((game) => {
        switch (gameEvent) {
            case GameEvent.REVEAL:
                game.reveal(x, y);
                game.markModified('tagMap');
                game.save();
                break;
            case GameEvent.TAG:
                game.tag(x, y);
                game.markModified('tagMap');
                game.save();
                break;
            case GameEvent.QUICK_CLEAR:
                game.quickClear(x, y);
                game.markModified('tagMap');
                game.save();
                break;
            case GameEvent.REPLAY:
                game.replay();
                game.markModified('tagMap');
                game.save();
                break;
        }
        gameLog = game;
    })
    mongoose.connect(url, {useNewUrlParser: true}).then(
        () => {
            res.json({gameLog});
        });

});

// /* GET all games. */
// router.get('/', (req, res) => {
//     MongoClient.connect(url).then((client)=>{
//         let db = client.db('TicTacToe');
//         db.collection("game").insertOne(grid).then((result)=>{
//             res.json({_id: result.insertedId});
//         })
//         client.close();
//     });
// });

module.exports = router;
