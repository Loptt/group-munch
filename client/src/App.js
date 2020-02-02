import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register'
import NewGroup from "./components/NewGroup";
import ViewGroup from "./components/ViewGroup";
import EditGroup from "./components/EditGroup";
import {SERVER_URL} from './config';

export default class App extends Component {
    constructor() {
        super();

        this.state = {
            loggedIn: false,
            user: {},
            selectedGroup: {}
        }
    }

    logout = () => {
        this.setState({
            loggedIn: false,
            user: {}
        });

        localStorage.setItem('gm_token', null);
    }

    setSuccessLoginState = (response) => {
        this.setState({
            loggedIn: true,
            user: {
                id: response.id,
                token: response.token,
                fName: response.firstName,
                lName: response.lastName,
            }
        })
    }

    handleSuccessfulAuth = (response) => {
        this.setSuccessLoginState(response);

        localStorage.setItem('gm_token', response.token);
    }

    handleSelectedGroup = (group) => {
        this.setState({
            selectedGroup: group
        })
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
                    this.setSuccessLoginState(responseJSON);
                    console.log(responseJSON);
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
                            handleSelectedGroup={this.handleSelectedGroup}
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
                    <Route
                        exact
                        path={"/new/group"}
                        render={props => (
                        <NewGroup
                            {...props}
                            loggedIn={this.state.loggedIn}
                            user={this.state.user}
                            logout={this.logout}
                        />
                        )}
                    />
                    <Route
                        exact
                        path={"/view/group"}
                        render={props => (
                        <ViewGroup
                            {...props}
                            group={this.state.selectedGroup}
                            loggedIn={this.state.loggedIn}
                            user={this.state.user}
                            logout={this.logout}
                        />
                        )}
                    />
                    <Route
                        exact
                        path={"/edit/group"}
                        render={props => (
                        <EditGroup
                            {...props}
                            group={this.state.selectedGroup}
                            loggedIn={this.state.loggedIn}
                            user={this.state.user}
                            logout={this.logout}
                        />
                        )}
                    />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

