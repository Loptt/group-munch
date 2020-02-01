import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register'
import {SERVER_URL} from './config';

export default class App extends Component {
    constructor() {
        super();

        this.state = {
            loggedIn: false,
            user: {}
        }
    }

    logout = () => {
        this.setState({
            loggedIn: false,
            user: {}
        });

        localStorage.setItem('gm_token', null);
    }

    handleSuccessfulAuth = (response) => {
        this.setState({
            loggedIn: true,
            user: {
                id: response.id
            }
        });

        localStorage.setItem('gm_token', response.token);
    }

    checkTokenLocalStorage() {
        console.log('checking if logged in')
        let token = localStorage.getItem('gm_token');

        if (token == null || token == undefined || token === "null") {

            return;
        }

        let url = `${SERVER_URL}/api/validate/${token}`
        let settings = {
            method: "GET"
        }

        fetch(url, settings)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error();
            })
            .then(responseJSON => {
                if (responseJSON.message === "success") {
                    this.setState({
                        loggedIn: true,
                        user: {
                            id: responseJSON.id
                        }
                    })
                    console.log('Logged in from localstorage');
                } else if (responseJSON.message === "error"){
                    this.setState({
                        loggedIn: false,
                        user: {}
                    })
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    loggedIn: false,
                    user: {}
                })
            })
    }

    componentDidMount() {
        this.checkTokenLocalStorage();
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                <Switch>
                <Route
                    exact
                    path={"/"}
                    render={props => (
                    <Home
                        {...props}
                        loggedIn={this.state.loggedIn}
                        user={this.state.user}
                        logout={this.logout}
                    />
                    )}
                />
                <Route
                    exact
                    path={"/login"}
                    render={props => (
                    <Login
                        {...props}
                        loggedIn={this.state.loggedIn}
                        handleSuccessfulAuth={this.handleSuccessfulAuth}
                    />
                    )}
                />
                <Route
                    exact
                    path={"/register"}
                    render={props => (
                    <Register
                        {...props}
                        loggedIn={this.state.loggedIn}
                        handleSuccessfulAuth={this.handleSuccessfulAuth}
                    />
                    )}
                />
                </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

