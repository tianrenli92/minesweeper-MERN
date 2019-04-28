const express = require('express');
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/TicTacToe";
const router = express.Router();
const Grid = require('../models/Grid')

/* post a new game. */
router.post('/', (req, res) => {
    let {height, width, mines} = req.body;
    let grid = new Grid(height, width, mines);
    mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true}).then(
        ()=>{
        let db = client.db('TicTacToe');
        db.collection("game").insertOne(grid).then((result)=>{
            res.json({_id: result.insertedId});
        })
        client.close();
    });
});

/* GET all games. */
router.get('/', (req, res) => {
    MongoClient.connect(url).then((client)=>{
        let db = client.db('TicTacToe');
        db.collection("game").insertOne(grid).then((result)=>{
            res.json({_id: result.insertedId});
        })
        client.close();
    });
});

module.exports = router;
