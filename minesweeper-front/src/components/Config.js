import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import {Link} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Alert from "react-bootstrap/Alert";

export default class Config extends Component {
    constructor(props){
        super(props);
        this.state={
            height: '9',
            width: '9',
            mines: '10',
            isTextDisabled: true,
            msg: '',
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
            case('0'):
                this.setState({
                    height: '9',
                    width: '9',
                    mines: '10',
                    isTextDisabled: true,
                })
                break;
            case('1'):
                this.setState({
                    height: '16',
                    width: '16',
                    mines: '40',
                    isTextDisabled: true,
                })
                break;
            case('2'):
                this.setState({
                    height: '16',
                    width: '30',
                    mines: '99',
                    isTextDisabled: true,
                })
                break;
            case('3'):
                this.setState({
                    isTextDisabled: false,
                })
                break;
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        const {height, width, mines} = this.state;
        console.log(this.state);
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
            </div>
        )
    }
}
