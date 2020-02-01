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
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form'

export default function ViewGroup(props) {
    
    const [group, setGroup] = useState(props.group);
    const [members, setMembers] = useState([]);
    const [places, setPlaces] = useState([]);
    const [memberEmail, setMemberEmail] = useState('');
    const [showAddMember, setShowAddMember] = useState(false);
    const [showAddPlace, setShowAddPlace] = useState(false);

    const [name, setName] = useState("initialState");
    const [desc, setDesc] = useState('initialState');
    const [price, setPrice] = useState(1);
    const [dist, setDist] = useState(1);

    useEffect(() => {
        if (group._id == undefined) {
            props.history.push('/');
        }
        fetchMembers();
        fetchPlaces();
    }, []);

    const getDistance = (num) => {
        switch(num) {
            case 1:
                return 'Close';
            case 2:
                return 'Medium';
            case 3:
                return 'Far';
        }
    }

    const getPrice = (num) => {
        switch(num) {
            case 1:
                return 'Cheap';
            case 2:
                return 'Medium';
            case 3:
                return 'Expensive';
        }
    }

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

    const fetchPlaces = () => {
        let url = `${SERVER_URL}/api/places/groups/${group._id}`;
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
                setPlaces(responseJSON);
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
                setShowAddMember(false);
                fetchMembers();
            })
            .catch(error => {
                console.log("ERROR...")
                console.log(error.statusText);
            })
    }

    const postNewPlace = () => {
        if (name === "" || dist === 0 || price === 0) {
            console.log("Missing parameters");
            console.log(dist);
            console.log(price);
            return;
        }

        let newPlace = {
            name: name,
            description: desc,
            distanceCategory: dist,
            priceCategory: price,
            group: group._id
        }

        let url = `${SERVER_URL}/api/places/create/`;
        let settings = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPlace)
        }

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(response);
            })
            .then(responseJSON => {
                setShowAddPlace(false);
                fetchPlaces();
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

    const handleClickAddPlace = event => {
        if (showAddPlace) {
            postNewPlace();
        } else {
            setShowAddPlace(true);
        }
    }

    const onEmailChange = event => {
        setMemberEmail(event.target.value);
    }

    const handleCancelAddMember = event => {
        setShowAddMember(false);
    }

    const handleCancelAddPlace = event => {
        setShowAddPlace(false);
    }

    const onNameChange = event => {
        setName(event.target.value);
    }

    const onDescChange = event => {
        setDesc(event.target.value);
    }

    const onDistChange = event => {
        setDist(event.target.value);
    }

    const onPriceChange = event => {
        setPrice(event.target.value);
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

    const placeForm = () => {
        return (
            <Form className='add-place-form'>
                <Form.Group>
                    <Form.Control type="text" placeholder="Name" onChange={onNameChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Distance</Form.Label>
                    <Form.Control as="select" onChange={onDistChange}>
                        <option value={1}>Close</option>
                        <option value={2}>Medium</option>
                        <option value={3}>Far</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control as="select" onChange={onPriceChange}>
                        <option value={1}>Cheap</option>
                        <option value={2}>Medium</option>
                        <option value={3}>Expensive</option>
                    </Form.Control>
                </Form.Group>
            </Form>
        )
    }

    const cancelPlaceFrom = () => {
        return (
            <p className="cancel-member" onClick={handleCancelAddPlace}>Cancel</p>
        )
    }

    return (
        <>
            <Navigation handleLogout={handleLogout}/>
            <Container>
                <Jumbotron className='header'>
                    <h1 className="title">{group.name}</h1>
                    <p>{group.description}</p>
                </Jumbotron>
                <Row>
                    <Col lg='6'>
                        <h2>Places</h2>
                        {places.map((place, i) => {
                            return (
                                <Card className="group-card" style={{ width: '18rem' }}>
                                    <Card.Img variant="top" src={place.image} />
                                    <Card.Body>
                                        <Card.Title>{place.name}</Card.Title>
                                        <Card.Text>
                                            {place.description}
                                        </Card.Text>
                                        <Button value={place._id} variant="flat">Edit</Button>
                                    </Card.Body>
                                </Card>
                            )
                        })}
                        {showAddPlace ? placeForm() : null}
                        <Button variant='flat' bg='flat' className='add-btn' onClick={handleClickAddPlace}>Add place</Button>
                        {showAddPlace ? cancelPlaceFrom() : null}
                    </Col>
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