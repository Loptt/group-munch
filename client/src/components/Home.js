import React, { Component } from "react";
import Container from "react-bootstrap/Container"

export default class Home extends Component {
    constructor(props) {
        super(props);
    }

    checkLogin() {
        return this.props.loggedIn;
    }

    componentDidMount() {
        if (!this.checkLogin()) {
            this.props.history.push("/login");
        }
    }

    render() {
        return (
            <Container>
                <h1>Hola</h1>
            </Container>
        );
    }
}

