import React, { Component } from 'react';
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";

const SQUARE_WIDTH = 20;
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
    constructor(props){
        super(props);
        this.state={
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
        this.updateGame();
    }

    updateGame() {
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

    draw(){
        const {height, width, clientMap} = this.state;
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        for(let i=1; i<= height; i++){
            for(let j=1; j<=width; j++){
                switch(clientMap[i][j]){
                    case ' ':
                        this.drawRectangle(ctx, i, j, "", BG_COLOR_UNREVEALED, BG_COLOR_UNREVEALED);
                        break;
                    case 'F':
                        this.drawRectangle(ctx, i, j, "F", BG_COLOR_TAGGED, TAG_COLOR);
                        break;
                    case '?':
                        this.drawRectangle(ctx, i, j, "?", BG_COLOR_QUESTIONED, QUESTION_COLOR);
                        break;
                    case 'X':
                        this.drawRectangle(ctx, i, j, "X", BG_COLOR_EXPLODED, MINE_COLOR);
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
        ctx.strokeStyle = textColor;
        ctx.strokeText(text, xx + 7, yy + 14);
    }

render() {
        return (
            <div>
                <div className="m-2">
                    <Link to={'/games'}><Button>Back</Button></Link>
                </div>
                <div>
                    <canvas ref={this.canvasRef} width={600} height={320}/>
                </div>
            </div>
        )
    }
}
