import React, {Component} from 'react';
import Form from 'react-bootstrap/Form';
import {Link} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Alert from "react-bootstrap/Alert";

export default class Config extends Component {
    constructor(props){
        super(props);
        this.state={
            height: '',
            width: '',
            mines: '',
            msg: '',
        }
    }

    handleChange(event) {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        this.setState({[fieldName]: fieldVal})
    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
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
                        <Form.Check inline type='radio' name='difficulty' id='0' label='Easy'/>
                        <Form.Check inline type='radio' name='difficulty' id='1' label='Medium'/>
                        <Form.Check inline type='radio' name='difficulty' id='2' label='Hard'/>
                        <Form.Check inline type='radio' name='difficulty' id='3' label='Custom'/>
                    </div>
                    <Form.Group controlId="formGroupHeight">
                        <Form.Label>Height</Form.Label>
                        <Form.Control name="height" defaultValue="9" onChange={this.handleChange.bind(this)}/>
                    </Form.Group>
                    <Form.Group controlId="formGroupWidth">
                        <Form.Label>Width</Form.Label>
                        <Form.Control name="width" defaultValue="9" onChange={this.handleChange.bind(this)}/>
                    </Form.Group>
                    <Form.Group controlId="formGroupMines">
                        <Form.Label>Mines</Form.Label>
                        <Form.Control name="mines" defaultValue="10" onChange={this.handleChange.bind(this)}/>
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
