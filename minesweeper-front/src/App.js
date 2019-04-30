import React, {Component} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Games from './Games';
import Config from "./Config";
import Game from "./Game";

class App extends Component {

    render() {
        return (
            <Router>
                <div className="container">
                    <h2>Welcome to Minesweeper!</h2>
                    <hr />
                    <Switch>
                        <Route exact path="/" render={()=>(<Redirect to="/games"/>)}/>
                        <Route exact path='/games' component={ Games } />
                        <Route exact path='/games/new' component={ Config } />
                        <Route exact path='/games/:gameId' component={ Game } />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
