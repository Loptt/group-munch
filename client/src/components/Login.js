import React, { Component, useState } from "react";
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Container from "react-bootstrap/Container";

export default function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onEmailChange = event => {
        setEmail(event.target.value);
    }

    const onPasswordChange = event => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(email, password);

        let url = "http://localhost:8080/api/login";
        let settings = {
            method: "POST"
        }

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(responseJSON => {
                console.log(responseJSON);
            })
    /*
        axios
            .post(
                "http://localhost:8080/api/login",
                {
                    'email': email,
                    'password': password
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
            });*/
    }

    return (
        <Container>
            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control type="email" placeholder="Email" onChange={onEmailChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Control type="password" placeholder="Password" onChange={onPasswordChange}/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

