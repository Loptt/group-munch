import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container"
import Navigation from "./Navigation"

export default function Home (props) {

    useEffect(() => {
        checkLogin();
    }, [])

    const checkLogin = () => {
        if (!props.loggedIn) {
            props.history.push("/login");
        }
    }

    const handleLogout = () => {
        props.logout();
    }

    return (
        <>
            <Navigation handleLogout={handleLogout}/>
            <Container>
                <h1>Groups</h1>
            </Container>
        </>
    );

}

