import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import axios from "axios";

import Table from 'react-bootstrap/Table';

export default class Games extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGamesLoaded: false,
            games: []
        };
    }

    componentDidMount() {
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
                console.log(this.state);
            })
            .catch(error => console.log(error));
    }

    render() {
        const isGamesLoaded = this.state.isGamesLoaded;
        const games = this.state.games;
        return (
            <div>
                {isGamesLoaded ? null : <p>Loading...</p>}
            </div>
            <Table striped bordered hover>
                <thead>
                <tr>
                <th>#</th>
            <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
            </tr>
            </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td colSpan="2">Larry the Bird</td>
                    <td>@twitter</td>
                </tr>
                </tbody>
                </Table>
        )
    }
}
