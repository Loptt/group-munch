import React, {useState, useEffect} from 'react';
import Navigation from './Navigation';
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'

export default function NewGroup (props) {
    const handleSubmit = event => {
        event.preventDefault();
    }

    return (
        <>
            <Navigation/>
            <Container>
                <h1 className="title">
                    Create new Group
                </h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Name" required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control as="textarea" placeholder="Description" rows="3" required />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        </>
    )
}