import React, { useState, useEffect } from 'react';
import './css/ViewGroup.css'
import Navigation from './Navigation';
import EditPlace from './EditPlace'
import Voting from './Voting';
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
import Modal from 'react-bootstrap/Modal'
import {Pencil} from 'react-bootstrap-icons';

export default function ViewGroup(props) {
    
    const [group, setGroup] = useState(props.group);
    const [members, setMembers] = useState([]);
    const [places, setPlaces] = useState([]);
    const [placesBool, setPlacesBool] = useState([]);
    const [memberEmail, setMemberEmail] = useState('');
    const [showAddMember, setShowAddMember] = useState(false);
    const [showAddPlace, setShowAddPlace] = useState(false);
    const [showDeleteMember, setShowDeleteMember] = useState(false);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [manager, setManager] = useState('');

    const [name, setName] = useState("initialState");
    const [desc, setDesc] = useState('initialState');
    const [price, setPrice] = useState(1);
    const [dist, setDist] = useState(1);

    const [useless, setUseless] = useState(0);

    useEffect(() => {
        checkLogin();
        if (group._id == undefined) {
            props.history.push('/');
        }
        fetchMembers();
        fetchPlaces();
    }, []);

    useEffect(() => {
        console.log("Places change!")
    }, [places]);

    const checkLogin = () => {
        if (!props.loggedIn) {
            props.history.push("/login");
        }
    }

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

    const isManager = () => {
        return group.manager === props.user.id;
    }

    const isManagerId = (id) => {
        return group.manager === id;
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
                let i = responseJSON.findIndex(m => m._id === group.manager);
                setManager(responseJSON[i].firstName + " " + responseJSON[i].lastName);
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
                console.log(responseJSON);
                let newPlacesBool = []
                responseJSON.forEach(p => {
                    console.log('Pussshing')
                    newPlacesBool.push(false);
                });

                setPlacesBool(newPlacesBool);

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

    const deleteMember = id => {
        let url = `${SERVER_URL}/api/groups/${group._id}/delete-member/${id}`;
        let settings = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        }

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(response);
            })
            .then(responseJSON => {
                console.log('Deleted..');
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

    const handleClickAddPlace = event => {
        console.log(placesBool);
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

    const handleGroupEditClick = event => {
        props.history.push('/edit/group');
    }

    const HandleDeleteCurrentGroup = event => {
        let url = `${SERVER_URL}/api/groups/delete/${group._id}`;
        let settings = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
        }

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    console.log('Deleted..');
                    props.history.push('/');
                }

                throw new Error(response);
            })
            .catch(error => {
                console.log(error);
                console.log(error.statusText);
            })
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

    const onClickDeleteMember = (event) => {
        if (!isManager()) {
            return;
        }

        let memberId = event.target.childNodes[3].value;

        if (isManagerId(memberId)) {
            return;
        }

        if (event.target.childNodes[3].style.display === 'none') {
            event.target.childNodes[3].style.display = 'inline';
        } else {
            event.target.childNodes[3].style.display = 'none';
        }
    }

    const onClickBtnDeleteMember = (event) => {
        event.stopPropagation();
        let id = event.target.value;
        deleteMember(id);
    }

    const toggleEditPlaceForm = (i) => {
        let newPlaces = places;
        newPlaces[i].showForm = !newPlaces[i].showForm;
        setPlaces(newPlaces);

        // This thing is here because react doesn't know how to handle rerenders properly
        setUseless(useless+1);
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
            <Navigation user={props.user} handleLogout={handleLogout}/>
            <Modal show={showDeleteWarning} onHide={1}>
                <Modal.Header closeButton>
                <Modal.Title>Delete group?</Modal.Title>
                </Modal.Header>
                <Modal.Body>All saved places and voting events will be lost</Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={HandleDeleteCurrentGroup}>
                    Delete
                </Button>
                <Button variant="default" onClick={event => setShowDeleteWarning(false)}>
                    Cancel
                </Button>
                </Modal.Footer>
            </Modal>
            <Container>
                <Jumbotron className='header'>
                    <h1 className="title">{group.name}</h1>
                    <h4>{group.description}</h4>
                    <p className="text-muted">By {manager}</p>
                </Jumbotron>
                <Row>
                    <Col lg='6'>
                        <h2>Places</h2>
                        {places.map((place, i) => {
                            return (
                                <>
                                    <Card className="group-card-view">
                                        <Card.Img variant="top" src={place.image} />
                                        <Card.Body>
                                            <Card.Title>{place.name}</Card.Title>
                                            <Card.Text>
                                                {place.description}
                                            </Card.Text>
                                            <Card.Text>
                                                Distance: {getDistance(place.distanceCategory)}
                                            </Card.Text>
                                            <Card.Text>
                                                Price: {getPrice(place.priceCategory)}
                                            </Card.Text>
                                            <Button value={place._id} onClick={(event) => toggleEditPlaceForm(i)} className='flat-btn' variant="flat">
                                                {place.showForm ? "Hide" : "Edit"}
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                    {place.showForm ? 
                                        <EditPlace cancelEditEvent={() => toggleEditPlaceForm(i)} updatePlace={fetchPlaces} className='edit-place-form' place={place}/>
                                        : null
                                    }
                                </>
                            )
                        })}
                        {showAddPlace ? placeForm() : null}
                        <Button variant='flat' bg='flat' className='add-btn flat-btn' onClick={handleClickAddPlace}>Add place</Button>
                        {showAddPlace ? cancelPlaceFrom() : null}
                    </Col>
                    <Col lg='6'>
                        <Voting/>
                        <h2>Members</h2>
                        <ListGroup className='members'>
                            {members.map((member, i) => {
                                return (
                                    <ListGroup.Item action onClick={onClickDeleteMember}>
                                        {member.firstName} {member.lastName}
                                        <Button className='delete-btn' variant='outline-danger' value={member._id} size='sm' onClick={onClickBtnDeleteMember}>
                                            Remove
                                        </Button>
                                    </ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                        {isManager() ? <p className='remove-hint mt-2'>Double click to remove</p>: null}
                        {showAddMember ? memberForm() : null}
                        <Button variant='flat' bg='flat' className='add-btn flat-btn' onClick={handleClickAddMember}>Add member</Button>
                        {showAddMember ? cancelMemberFrom() : null}
                    </Col>
                </Row>
                {isManager() ? <Button variant='outline-danger' className='delete-group mt-2 mb-4' onClick={event => setShowDeleteWarning(true)}>Delete Group</Button> : null}
            </Container>
            {isManager() ?
                <div className="fixed-bottom add-button">
                    <span class="dot" onClick={handleGroupEditClick}><Pencil/></span>
                </div>
                : null
            }
            <style type="text/css">
                {`
                .flat-btn {
                    background-color: #e4f9f5;
                }
                .delete-btn {
                    display: none;
                    margin-left: 25px;
                }
                `}
            </style>
        </>
    )
}