import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom/cjs/react-router-dom";
import {SERVER_URL} from '../config'
import CustomAlert from './CustomAlert'

export default function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [alertVariant, setAlertVariant] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
       checkLogin();
    }, [props.loggedIn]);

    const checkLogin = () => {
        if (props.loggedIn) {
            props.history.push("/");
        }
    }

    const onCloseAlert = () => {
        setShowAlert(false);
    }

    const onEmailChange = event => {
        setEmail(event.target.value);
    }

    const onPasswordChange = event => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(email, password);

        let url = `${SERVER_URL}/api/login`;
        let settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }

        console.log("sending...");

        fetch(url, settings)
            .then(response => {
                console.log(response);
                if (response.ok) {
                    return response.json();
                }

                throw new Error(response.statusText);
            })
            .then(responseJSON => {
                props.handleSuccessfulAuth(responseJSON);
                props.history.push("/");

            })
            .catch(error => {
                setAlertMessage('Login error');
                setAlertVariant('danger');
                setShowAlert(true);
                console.log(error);
            })

            console.log("Bueno pues");
    }

    return (
        <Container>
            <CustomAlert variant={alertVariant} message={alertMessage} show={showAlert} onClose={onCloseAlert}/>
            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control type="email" placeholder="Email" onChange={onEmailChange} required/>
                </Form.Group>
                <Form.Group>
                    <Form.Control type="password" placeholder="Password" onChange={onPasswordChange} required/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <p>Or register <Link to="/register">here</Link></p>
        </Container>
    );
}

