import React, { Component } from 'react';
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";

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
            })
            .catch(error => console.log(error));
    }


    render() {
        return (
            <div>
                <div className="m-2">
                    <Link to={'/games'}><Button>Back</Button></Link>
                </div>
            </div>
        )
    }
}
