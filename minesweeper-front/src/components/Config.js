import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import {Link, Redirect} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Alert from "react-bootstrap/Alert";
import axios from "axios";

export default class Config extends Component {
    constructor(props){
        super(props);
        this.state={
            height: '9',
            width: '9',
            mines: '10',
            isTextDisabled: true,
            msg: '',
            redirectGameId: '',
        }
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleDifficultyChange = this.handleDifficultyChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleTextChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]: value})
    }

    handleDifficultyChange(event){
        let id = event.target.id;
        switch(id){
            case '0':
                this.setState({
                    height: '9',
                    width: '9',
                    mines: '10',
                    isTextDisabled: true,
                })
                break;
            case '1':
                this.setState({
                    height: '16',
                    width: '16',
                    mines: '40',
                    isTextDisabled: true,
                })
                break;
            case '2':
                this.setState({
                    height: '16',
                    width: '30',
                    mines: '99',
                    isTextDisabled: true,
                })
                break;
            case '3':
                this.setState({
                    isTextDisabled: false,
                })
                break;
            default:
                break;
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        const {height, width, mines} = this.state;
        if(isNaN(height)){
            this.setState({msg:'Height is not number.'});
            return;
        }
        if(isNaN(width)){
            this.setState({msg:'Width is not number.'});
            return;
        }
        if(isNaN(mines)){
            this.setState({msg:'Mines is not number.'});
            return;
        }
        if (height < 1 || height > 16) {
            this.setState({msg:'Height should be between 1 and 16.'});
            return;
        }
        if (width < 1 || width > 30) {
            this.setState({msg:'Width should be between 1 and 30.'});
            return;
        }
        if (mines < 1 || mines >= height * width) {
            this.setState({msg:`Mines should be between 1 and ${height * width - 1} (squares - 1).`});
            return;
        }
        this.createGame(height, width, mines);
    }

    createGame(height, width, mines){
        axios
            .post('http://127.0.0.1:3001/api/v1/games', {height, width, mines})
            .then(response => {
                const {gameId} = response.data;
                this.setState({redirectGameId: gameId});
            })
            .catch(error => console.log(error));
    }

    renderRedirect(){
        const {redirectGameId} = this.state;
        if (redirectGameId) {
            return <Redirect to={`/games/${redirectGameId}`} />
        }
    }
    render() {
        const {msg} = this.state;
        return (
            <div>
                <div className="m-2">
                    <Link to={'/games'}><Button>Back</Button></Link>
                </div>
                <h4>
                    Game Configurations
                </h4>
                <Form onSubmit={e => this.handleSubmit(e)}>
                    <div className="mb-3">
                        <Form.Check inline type='radio' name='difficulty' id='0' label='Easy' defaultChecked onChange={this.handleDifficultyChange}/>
                        <Form.Check inline type='radio' name='difficulty' id='1' label='Medium' onChange={this.handleDifficultyChange}/>
                        <Form.Check inline type='radio' name='difficulty' id='2' label='Hard' onChange={this.handleDifficultyChange}/>
                        <Form.Check inline type='radio' name='difficulty' id='3' label='Custom' onChange={this.handleDifficultyChange}/>
                    </div>
                    <Form.Group controlId="formGroupHeight">
                        <Form.Label>Height</Form.Label>
                        <Form.Control name="height" value={this.state.height} disabled={this.state.isTextDisabled} onChange={this.handleTextChange}/>
                    </Form.Group>
                    <Form.Group controlId="formGroupWidth">
                        <Form.Label>Width</Form.Label>
                        <Form.Control name="width" value={this.state.width} disabled={this.state.isTextDisabled} onChange={this.handleTextChange}/>
                    </Form.Group>
                    <Form.Group controlId="formGroupMines">
                        <Form.Label>Mines</Form.Label>
                        <Form.Control name="mines" value={this.state.mines} disabled={this.state.isTextDisabled} onChange={this.handleTextChange}/>
                    </Form.Group>
                    <Button variant="success" type="submit">
                        Start Game
                    </Button>
                </Form>
                {msg &&
                <Alert variant='danger' className={'m-3'}>
                    {msg}
                </Alert>
                }
                {this.renderRedirect()}
            </div>
        )
    }
}
