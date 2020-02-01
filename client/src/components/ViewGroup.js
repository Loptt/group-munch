import React, { useState, useEffect } from 'react';
import './css/ViewGroup.css'
import Navigation from './Navigation';
import {SERVER_URL} from '../config'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

export default function ViewGroup(props) {
    
    const [group, setGroup] = useState(props.group);
    const [members, setMembers] = useState([]);
    const [memberEmail, setMemberEmail] = useState('');
    const [showAddMember, setShowAddMember] = useState(false);

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

    const postNewMember = (email) => {
        let url = `${SERVER_URL}/api/groups/${group._id}/add_member_email`;
        let settings = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email_member: email
            })
        }

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(response);
            })
            .then(responseJSON => {
                console.log(responseJSON);
                fetchMembers();
            })
            .catch(error => {
                console.log("ERROR...")
                console.log(error.statusText);
            })
    }

    const handleLogout = () => {
        props.logout();
    }

    const handleClickAddMember = event => {
        if (showAddMember) {
            if (memberEmail !== "") {
                postNewMember(memberEmail);
            } else {
                setShowAddMember(false);
            }
        } else {
            setShowAddMember(true);
        }
    }

    const handleCancelAddMember = event => {
        setShowAddMember(false);
    }

    const onEmailChange = event => {
        setMemberEmail(event.target.value);
    }

    const memberForm = () => {
        return (
            <InputGroup className='mb-3 add-member-form'>
                <FormControl type='email' placeholder="Member Email" onChange={onEmailChange}/>
            </InputGroup>
        )
    }

    const cancelMemberFrom = () => {
        return (
            <p className="cancel-member" onClick={handleCancelAddMember}>Cancel</p>
        )
    }

    return (
        <>
            <Navigation handleLogout={handleLogout}/>
            <Container>
                <Jumbotron className='header'>
                    <h1 className="title">{group.name}</h1>
                </Jumbotron>
                <Row>
                    <Col lg='6'>
                        <h2>Members</h2>
                        <ListGroup className='members'>
                            {members.map((member, i) => {
                                return (
                                    <ListGroup.Item variant="light">{member.firstName} {member.lastName}</ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                        {showAddMember ? memberForm() : null}
                        <Button variant='flat' bg='flat' className='add-btn' onClick={handleClickAddMember}>Add member</Button>
                        {showAddMember ? cancelMemberFrom() : null}
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