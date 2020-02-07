import React, { useState, useEffect } from "react";
import './css/Navigation.css'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Alert from 'react-bootstrap/Alert'

export default function Navigation (props) {

    return (
        <>
            <Navbar bg="flat" variant="dark" className="main-navbar" expand="lg" fixed='top'>
                <Navbar.Brand href='/'>GroupMunch</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="justify-content-end ml-auto" >
                        <Navbar.Text>Hi, {props.user.fName} {props.user.lName}</Navbar.Text>
                        <Nav.Link className='ml-4' onClick={props.handleEditProfile}>Edit Profile</Nav.Link>
                        <Nav.Link className='ml-4' onClick={props.handleLogout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );

}

