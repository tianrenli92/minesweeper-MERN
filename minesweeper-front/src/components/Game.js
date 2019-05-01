import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import GameEvent from '../models/GameEvent';
import GameStatusText from '../models/GameStatusText';

const SQUARE_WIDTH = 25;
const BG_COLOR_UNREVEALED = 'lightblue';
const BG_COLOR_TAGGED = 'yellow';
const BG_COLOR_QUESTIONED = 'lightgreen';
const BG_COLOR_REVEALED = 'white';
const BG_COLOR_EXPLODED = 'red';
const TAG_COLOR = 'red';
const QUESTION_COLOR = 'green';
const MINE_COLOR = 'black';
const NUMBER_COLOR = ['white', 'blue', 'green', 'red', 'darkblue', 'darkred', 'darkgreen', 'purple', 'orange'];

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: props.match.params.gameId,
            height: null,
            width: null,
            mines: null,
            squares: null,
            unrevealedSafeSquares: null,
            untaggedMines: null,
            gameStatus: null,
            clientMap: []
        };
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.getGame();
    }

    getGame() {
        const {gameId} = this.state;
        axios
            .get('http://127.0.0.1:3001/api/v1/games/' + gameId)
            .then(response => {
                const games = response.data;
                this.setState(games);
                this.draw();
            })
            .catch(error => console.log(error));
    }

    draw() {
        const {height, width, clientMap} = this.state;
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        for (let i = 1; i <= height; i++) {
            for (let j = 1; j <= width; j++) {
                switch (clientMap[i][j]) {
                    case ' ':
                        this.drawRectangle(ctx, i, j, '', BG_COLOR_UNREVEALED, BG_COLOR_UNREVEALED);
                        break;
                    case 'F':
                        this.drawRectangle(ctx, i, j, 'F', BG_COLOR_TAGGED, TAG_COLOR);
                        break;
                    case '?':
                        this.drawRectangle(ctx, i, j, '?', BG_COLOR_QUESTIONED, QUESTION_COLOR);
                        break;
                    case 'X':
                        this.drawRectangle(ctx, i, j, 'X', BG_COLOR_EXPLODED, MINE_COLOR);
                        break;
                    default:
                        this.drawRectangle(ctx, i, j, clientMap[i][j], BG_COLOR_REVEALED, NUMBER_COLOR[parseInt(clientMap[i][j])]);
                }
            }
        }
    }

    drawRectangle(ctx, x, y, text, bgColor, textColor) {
        const xx = (y - 1) * SQUARE_WIDTH;
        const yy = (x - 1) * SQUARE_WIDTH;
        // draw boundary
        ctx.fillStyle = 'black';
        ctx.fillRect(xx, yy, SQUARE_WIDTH, SQUARE_WIDTH);

        // draw rectangle
        ctx.fillStyle = bgColor;
        ctx.fillRect(xx + 1, yy + 1, SQUARE_WIDTH - 2, SQUARE_WIDTH - 2);

        // draw text
        ctx.font = '20px serif';
        ctx.fillStyle = textColor;
        ctx.fillText(text, xx + Math.round(SQUARE_WIDTH / 3) - 1, yy + Math.round(SQUARE_WIDTH / 3 * 2) + 2);
    }

    handleMouseUp(e) {
        e.persist();
        const {height, width} = this.state;
        const {button, offsetX, offsetY} = e.nativeEvent;
        const x = Math.floor(offsetY / SQUARE_WIDTH) + 1;
        const y = Math.floor(offsetX / SQUARE_WIDTH) + 1;
        if (x < 1 || x > height || y < 1 || y > width)
            return;
        if (button === 0) {
            this.putGame(GameEvent.REVEAL, x, y);
        } else if (button === 2) {
            this.putGame(GameEvent.TAG, x, y);
        } else if (button === 1) {
            this.putGame(GameEvent.QUICK_CLEAR, x, y);
        }
    }

    putGame(gameEvent, x, y) {
        const {gameId} = this.state;
        axios
            .put('http://127.0.0.1:3001/api/v1/games/' + gameId, {gameEvent, x, y})
            .then(response => {
                const games = response.data;
                this.setState(games);
                this.draw();
            })
            .catch(error => console.log(error));
    }

    handleReplayClick() {
        this.putGame(GameEvent.REPLAY, 0, 0);
    }

    render() {
        const {unrevealedSafeSquares, untaggedMines: untaggedMines, gameStatus} = this.state;
        return (
            <div>
                <div className="my-2">
                    <Button className="mr-2" onClick={() => {
                        this.handleReplayClick()
                    }}>Replay Same Board</Button>
                    <Link to={'/games'}><Button>Back</Button></Link>
                </div>
                <div>
                    <p className="d-inline mr-4">Mines Left: {untaggedMines}</p>
                    <p className="d-inline mr-4">Squares Left: {unrevealedSafeSquares}</p>
                    <p className="d-inline">Status: </p>
                    <p className={"d-inline" + (gameStatus === 0 ? "" : " text-danger")}>{GameStatusText[gameStatus]}</p>
                </div>
                <div>
                    <canvas ref={this.canvasRef} width={SQUARE_WIDTH * 30} height={SQUARE_WIDTH * 16} onMouseUp={e => {
                        this.handleMouseUp(e)
                    }} onContextMenu={(e) => {
                        e.preventDefault();
                    }}/>
                </div>
            </div>
        )
    }
}
