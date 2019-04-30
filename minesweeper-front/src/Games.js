import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import axios from "axios";

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
                const newState = Object.assign({}, this.state, {
                    isGamesLoaded: true,
                    games: games,
                });
                console.log(newState);
                this.setState(newState);
            })
            .catch(error => console.log(error));
    }

    render() {
        return (
            <div>
                <p>Welcome to Games Component!!</p>
            </div>
        )
    }
}
