let express = require("express");
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let router = express.Router();
let path = require('path');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
let middleware = require('../middleware');
const saltRounds = 10;

let {UserController} = require('../models/user');
let ServerError = require('../error');

router.get('/all', jsonParser, (req, res) => {
    UserController.getAll()
        .then(users => {
            return res.status(200).json(users);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "Database error";
            return res.status(500).send();
        })
});

router.get('/email', jsonParser, (req, res) => {
    let email = req.query.email;

    if (email == undefined) {
        res.statusMessage = "No email given to get users";
        res.status(406).send();
    }

    UserController.getByEmail(email)
        .then(user => {
            if (user == null) {
                res.statusMessage = "No user found with given email";
                return res.status(404).send();
            }

            return res.status(200).json(user);
        });
});

router.post('/create', jsonParser, (req, res) => {
    let firstName, lastName, email, password;

    firstName = req.body.firstName;
    lastName = req.body.lastName;
    email = req.body.email;
    password = req.body.password;

    if (firstName == undefined || lastName == undefined || email == undefined || password == undefined) {
        res.statusMessage = "Parameters to create users incomplete";
        return res.status(406).send();
    }

    UserController.getByEmail(email)
        .then(user => {
            if (user != null) {
                throw new ServerError(409);
            }

            return bcrypt.hash(password, saltRounds);
        })
        .then(hash => {
            console.log(hash)
            return UserController.create({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hash
            });
        })
        .then(nu => {
            return res.status(201).json(nu);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 409) {
                res.statusMessage = "User with given email already exists";
                return res.status(409).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});

router.put('/update/:id', jsonParser, middleware.isLoggedIn, async (req, res) => {
    let id = req.params.id;

    if (id == undefined) {
        res.statusMessage = "No id given to update";
        return res.status(406).send();
    }

    UserController.getById(id)
        .then(user => {
            if (user == null) {
                throw new ServerError(404, "ID not found");
            }
            let {firstName, lastName, email, profilePicture} = req.body;
        
            if (firstName == undefined && lastName == undefined && email == undefined && profilePicture == undefined) {
                res.statusMessage = "No parameters to modify in update";
                return res.status(409).send();
            }

            let newUser = {};

            if (firstName != undefined) {
                newUser.firstName = firstName;
            }
            if (lastName != undefined) {
                newUser.lastName = lastName;
            }
            if (profilePicture != undefined) {
                newUser.profilePicture = profilePicture;
            }
            if (email != undefined) {
                newUser.email = profilePicture;
            }

            return UserController.update(id, newUser);
        })
        .then(nu => {
            return res.status(202).json(nu);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "User not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});

router.delete('/delete/:id', jsonParser, middleware.isLoggedIn, (req, res) => {
    let id = req.params.id;
    
    if (id == undefined) {
        res.statusMessage = "No ID given to delete";
        return res.status(406).send();
    }

    UserController.getById(id)
        .then(user => {
            if (user == null) {
                throw new ServerError(404);
            }

            return UserController.delete(id);
        })
        .then(user => {
            return res.status(200).send();
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "User not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});

router.get('/:id', jsonParser, (req, res) => {
    let id = req.params.id;

    if (id == undefined) {
        res.statusMessage = "No id given to get users";
        return res.status(406).send();
    }

    UserController.getById(id)
        .then(user => {
            if (user == null) {
                throw new ServerError(404, "ID not found");
            }
            return res.status(200).json(user);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "User not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});

module.exports = router;