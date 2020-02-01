import React, { useState, useEffect } from "react";
import {SERVER_URL} from '../config'
import './css/Home.css';
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card'
import Navigation from "./Navigation";
import Button from 'react-bootstrap/Button';
import {Plus} from 'react-bootstrap-icons';

export default function Home (props) {

    const [groups, setGroups] = useState([]);

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

    const fetchGroups = (id) => {
        let url = `${SERVER_URL}/api/groups/by-member/${id}`;
        let settings = {
            method: 'GET'
        };

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error();
            })
            .then(responseJSON => {
                setGroups(responseJSON);
                console.log(responseJSON);
            })
            .catch(error => {
                console.log(error);
            })
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

    return (
        <>
            <Navigation handleLogout={handleLogout}/>
            <Container>
                <h1 className="title">Groups</h1>
                <div className="group-container">
                    {groups.map((group, i) => {
                        return (
                            <Card className="group-card" style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={group.image} />
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
        </>
    );

}

