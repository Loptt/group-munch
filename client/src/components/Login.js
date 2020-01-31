import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Container from "react-bootstrap/Container";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            loginErrors: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { email, password } = this.state;
    
        axios
          .post(
            "http://localhost:3001/api/login",
            {
              user: {
                email: email,
                password: password
              }
            },
            { withCredentials: true }
          )
          .then(response => {
            if (response.data.logged_in) {
              this.props.handleSuccessfulAuth(response.data);
            }
          })
          .catch(error => {
            console.log("login error", error);
          });
      }

    render() {
        return (
            <Container>
                <h1>Login</h1>
                <Form>
                    <Form.Group>
                        <Form.Control type="email" placeholder="Email"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="password" placeholder="Password"/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        );
    }
}

