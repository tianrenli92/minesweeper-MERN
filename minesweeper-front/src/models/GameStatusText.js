import GameStatus from './GameStatus';

function objectFlip(obj) {
    const ret = {};
    Object.keys(obj).forEach((key) => {
        ret[obj[key]] = key;
    });
    return ret;
}

let GameStatusText = objectFlip(GameStatus);
export default GameStatusText;
