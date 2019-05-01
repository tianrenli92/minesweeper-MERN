import React, {Component} from 'react';
import axios from "axios";
import {Link} from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import GameStatusText from '../models/GameStatusText';

export default class Games extends Component {
    gameId;
    mines;
    unrevealedSafeSquares;
    untaggedMines;
    gameStatus;
    editTime;

    constructor(props) {
        super(props);
        this.state = {
            isGamesLoaded: false,
            games: []
        };
    }

    componentDidMount() {
        this.updateGames();
    }

    updateGames() {
        axios
            .get("http://127.0.0.1:3001/api/v1/games")
            .then(response => {

                // create an array of contacts only with relevant data
                const games = response.data;

                // create a new "State" object without mutating
                // the original State object.
                this.setState({
                    isGamesLoaded: true,
                    games: games,
                });
            })
            .catch(error => console.log(error));
    }

    render() {
        const isGamesLoaded = this.state.isGamesLoaded;
        const games = this.state.games;
        return (
            <div>
                <div>{isGamesLoaded ? null : 'Loading...'}</div>
                {isGamesLoaded &&
                <div>
                    <div class="m-2">
                        <Button>New Game</Button>
                    </div>
                    <h4>
                        Game Progress
                    </h4>
                    <Table>
                        <thead>
                        <tr>
                            <th>Height</th>
                            <th>Width</th>
                            <th>Mines</th>
                            <th>Squares Left</th>
                            <th>Mines Left</th>
                            <th>Status</th>
                            <th>Last Play Time</th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {games.map((game, i) => {
                            return (
                                <tr key={game.gameId}>
                                    <td>{game.height}</td>
                                    <td>{game.width}</td>
                                    <td>{game.mines}</td>
                                    <td>{game.unrevealedSafeSquares}</td>
                                    <td>{game.untaggedMines}</td>
                                    <td>{GameStatusText[game.gameStatus]}</td>
                                    <td>{new Date(game.editTime).toLocaleString()}</td>
                                    <td><Link to={`/games/${game.gameId}`}><Button
                                        variant="success">Play</Button></Link>
                                    </td>
                                    <td><Button variant="danger" onClick={() => {
                                        this.deleteGame(game.gameId)
                                    }}>Delete</Button></td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </Table>
                </div>
                }
            </div>
        );
    }

    deleteGame(gameId) {
        console.log(gameId);
        axios.delete("http://127.0.0.1:3001/api/v1/games/" + gameId);
        this.updateGames();
    }
}
