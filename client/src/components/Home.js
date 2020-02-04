import React, { useState, useEffect } from "react";
import {SERVER_URL} from '../config'
import './css/Home.css';
import Navigation from "./Navigation";
import CustomAlert from './CustomAlert'
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Plus} from 'react-bootstrap-icons';

export default function Home (props) {

    const [groups, setGroups] = useState([]);

    const [alertVariant, setAlertVariant] = useState('danger');
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [term, setTerm] = useState('');

    const [emptyGroups, setEmptyGroups] = useState(false);

    useEffect(() => {
        checkLogin();

        let id = props.user.id;

        fetchGroups(id);
    }, []);

    const checkLogin = () => {
        if (!props.loggedIn) {
            props.history.push("/login");
        }
    }

    const onCloseAlert = () => {
        setShowAlert(false);
    }

    const fetchGroups = (id, term = '') => {
        let url;

        if (term !== '') {
            url = `${SERVER_URL}/api/groups/by-member/${id}?term=${term}`
        } else {
            url =`${SERVER_URL}/api/groups/by-member/${id}`;
        }

        let settings = {
            method: 'GET',
            headers: {
                authorization: 'Bearer ' + props.user.token
            }
        };

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error();
            })
            .then(responseJSON => {
                if (responseJSON.length < 1) {
                    setEmptyGroups(true);
                } else {
                    setGroups(responseJSON);
                    setEmptyGroups(false);
                }
                console.log(responseJSON);
            })
            .catch(error => {
                setAlertVariant('danger');
                setAlertMessage('Error getting your groups');
                setShowAlert(true);
                console.log(error);
            })
    }

    const searchGroups = (event) => {
        fetchGroups(props.user.id, term);
    }

    const searchGroupsForm = (event) => {
        event.preventDefault();
        searchGroups();
    }

    const handleLogout = () => {
        props.logout();
    }

    const handleMoreClick = (event) => {
        let id = event.target.value;
        let group = groups.find(group => group._id === id);
        
        props.handleSelectedGroup(group);

        props.history.push('/view/group');
    }

    const handleAddClick = (event) => {
        props.history.push('/new/group');
    }

    const groupsList = () => {
        return (
            <div className="group-container">
                    {groups.map((group, i) => {
                        return (
                            <Card className="group-card" style={{ width: '18rem' }}>
                                <Card.Img className='thumbnail' variant="top" src={group.image} />
                                <Card.Body>
                                    <Card.Title>{group.name}</Card.Title>
                                    <Card.Text>
                                        {group.description}
                                    </Card.Text>
                                    <Button value={group._id} variant="flat" onClick={handleMoreClick}>More</Button>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </div>
        )
    }

    const handleEditProfile = () => {
        props.history.push('/edit/profile');
    }

    return (
        <div className='app-container-x'>
            <Navigation user={props.user} handleLogout={handleLogout} handleEditProfile={handleEditProfile}/>
            <Container>
                <CustomAlert variant={alertVariant} message={alertMessage} show={showAlert} onClose={onCloseAlert}/>
                <h1 className="title">Groups</h1>
                <Form onSubmit={searchGroupsForm}>
                    <InputGroup className="mt-4">
                        <Form.Control type='text' placeholder="Group Name" onChange={e => setTerm(e.target.value)}/>
                        <InputGroup.Append>
                            <Button variant="flat" bg='flat'  onClick={searchGroups}>Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form>
                {emptyGroups ? <h3 className='my-4'>No groups found</h3> : groupsList()}
            </Container>
            <div className="fixed-bottom add-button">
                <span class="dot" onClick={handleAddClick}><Plus/></span>
            </div>
            <style type="text/css">
                {`
                .btn-flat {
                    background-color: #e4f9f5;
                }
                `}
            </style>
        </div>
    );

}

