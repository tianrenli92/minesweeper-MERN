import React, {Component} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import Games from './components/Games';
import Config from './components/Config';
import Game from './components/Game';

class App extends Component {

    render() {
        return (
            <Router>
                <div className="container">
                    <h2 className="m-3 text-center">Minesweeper</h2>
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
