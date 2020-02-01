import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Container from "react-bootstrap/Container";
import Modal from 'react-bootstrap/Modal'

export default function Register(props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");
    const [show, setShow] = useState(false);


    useEffect(() => {
       checkLogin();
    }, [props.loggedIn]);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const checkLogin = () => {
        if (props.loggedIn) {
            props.history.push("/");
        }
    }

    const onFirstNameChange = event => {
        setFirstName(event.target.value);
    }

    const onLastNameChange = event => {
        setLastName(event.target.value);
    }

    const onEmailChange = event => {
        setEmail(event.target.value);
    }

    const onPasswordChange = event => {
        setPassword(event.target.value);
    }

    const onPasswordConfChange = event => {
        setPasswordConf(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (password !== passwordConf) {
            handleShow();
            return;
        }

        let url = "http://localhost:8080/api/users/create";
        let settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                firstName,
                lastName,
            })
        }

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(response.statusText);
            })
            .then(responseJSON => {
                props.history.push("/login");

            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Paswords do not match</Modal.Title>
                </Modal.Header>
                <Modal.Body>Make sure password and password confirmation match</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container>
                <h1>Register</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Control type="text" placeholder="First Name" onChange={onFirstNameChange} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Last Name" onChange={onLastNameChange} required />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="email" placeholder="Email" onChange={onEmailChange} required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="password" placeholder="Password" onChange={onPasswordChange} required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="password" placeholder="Confirm Password" onChange={onPasswordConfChange} required/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                <p>Already registered? Login <Link to="/login">here</Link></p>
            </Container>
        </>
    );
}

