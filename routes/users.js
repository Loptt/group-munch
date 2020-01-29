let express = require("express");
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let router = express.Router();

let {UserController} = require('../models/user');

router.get('/api/users', jsonParser, (req, res) => {
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

router.get('/api/users-by-id', jsonParser, (req, res) => {
    let id = req.query.id;

    if (id == undefined) {
        res.statusMessage = "No id given to get users";
        res.status(406).send();
    }

    UserController.getById(id)
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "Database error";
            return res.status(500).send();
        });
});

router.get('/api/users-by-email', jsonParser, (req, res) => {
    let email = req.query.email;

    if (email == undefined) {
        res.statusMessage = "No email given to get users";
        res.status(406).send();
    }

    UserController.getByEmail(email)
        .then(user => {
            if (user == null) {
                res.statusMessage = "No user found with given email";
                res.status(404).send();
            }

            res.status(200).json(user);
        });
});

router.post('/api/create-user', jsonParser, (req, res) => {
    let firstName, lastName, email, pp;

    firstName = req.body.firstName;
    lastName = req.body.lastName;
    email = req.body.email;
    pp = req.body.profilePicture;

    if (firstName == undefined || lastName == undefined || email == undefined || pp == undefined) {
        res.statusMessage = "Parameters to create users incomplete";
        return res.status(406).send();
    }

    let newUser = {
        name: {
            firstName: firstName,
            lastName: lastName
        },
        email: email,
        profilePicture: pp
    }

    UserController.create(newUser)
        .then(nu => {
            return res.status(201).json(nu);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "Database error";
            return res.status(500).send();
        });
});

router.put('/api/update-user', jsonParser, async (req, res) => {
    let id = req.query.id;

    if (id == undefined) {
        res.statusMessage = "No id given to update";
        return res.status(406).send();
    }

    UserController.getById(id)
        .then(user => {
            //console.log(user);
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

            UserController.update(id, newUser)
                .then(nu => {
                    console.log(nu);
                    return res.status(202).json(nu);
                })
                .catch(error => {
                    console.log(error);
                    res.statusMessage = "Database error";
                    return res.status(500).send();
                });
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "Database error";
            return res.status(500).send();
        });

    
});

module.exports = router;