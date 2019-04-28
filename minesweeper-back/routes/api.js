const express = require('express');
const router = express.Router();

const gameRouter = require('./game');

/* GET home page. */
router.use('/games', gameRouter);

module.exports = router;
