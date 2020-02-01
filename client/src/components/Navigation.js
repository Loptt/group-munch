import React, { useState, useEffect } from "react";
import './css/Navigation.css'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function Navigation (props) {

    return (
        <>
            <Navbar bg="flat" variant="dark" className="main-navbar" expand="lg" fixed='top'>
                <Navbar.Brand href="/">GroupMunch</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="mr-auto">
                        <Nav.Link href="/login" onClick={props.handleLogout}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );

}

