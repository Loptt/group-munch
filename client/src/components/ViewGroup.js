import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import {SERVER_URL} from '../config'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button';

export default function ViewGroup(props) {
    
    const [group, setGroup] = useState(props.group);
    const [members, setMembers] = useState([]);

    useEffect(() => {
        console.log(group);
        fetchMembers();
    }, [])

    const fetchMembers = () => {
        let url = `${SERVER_URL}/api/groups/${group._id}/members`;
        let settings = {
            method: 'GET'
        }

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(response);
            })
            .then(responseJSON => {
                setMembers(responseJSON);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleLogout = () => {
        props.logout();
    }

    return (
        <>
            <Navigation handleLogout={handleLogout}/>
            <Container>
                <h1 className="title">{group.name}</h1>
                <Row>
                    <Col lg='6'>
                        <h2>Members</h2>
                        <ListGroup>
                            {members.map((member, i) => {
                                return (
                                    <ListGroup.Item variant="light">{member.firstName} {member.lastName}</ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                        <Button variant='flat' bg='flat'>Add member</Button>
                    </Col>
                    <Col lg='6'>
                        <h2>Places</h2>
                    </Col>
                </Row>
            </Container>
            <style type="text/css">
                {`
                .btn-flat {
                    background-color: #e4f9f5;
                }
                `}
            </style>
        </>
    )
}