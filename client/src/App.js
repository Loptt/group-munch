import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './App.css';
import Home from './components/Home';
import Login from './components/Login';

export default class App extends Component {
    constructor() {
        super();

        this.state = {
            loggedIn: false,
            user: {}
        }
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
                    />
                    )}
                />
                </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

