let express = require("express");
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let router = express.Router();
let path = require('path');
let jwt = require('jsonwebtoken');

let {UserController} = require('../models/user');
let ServerError = require('../error');

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
                return res.status(404).send();
            }

            return res.status(200).json(user);
        });
});

router.post('/api/create-user', jsonParser, (req, res) => {
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

            let newUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            }

            return UserController.create(newUser)
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

router.put('/api/update-user', jsonParser, async (req, res) => {
    let id = req.query.id;

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

            return UserController.update(id, newUser)
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

router.delete('/api/delete-user', jsonParser, (req, res) => {
    let id = req.query.id;
    
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
                res.statusMessage = "Database erro";
                return res.status(500).send();
            }
        });
});

router.post('/api/login', jsonParser, (req, res) => {
    let {email, password} = req.body;

    if (email == undefined || password == undefined) {
        res.statusMessage = "No email or password provided";
        return res.status(406).send();
    }

    UserController.getByEmail(email)
        .then(user => {
            if (user == null) {
                throw new ServerError(404, "User not found");
            }

            if (user.password !== password) {
                throw new ServerError(401, "Unvalid password");
            }

            let data = {
                email: email,
                id: user._id
            }

            let token = jwt.sign(data, 'secret', {
                expiresIn: 60 * 5
            });

            return res.status(200).json({token});
        })
        .catch(error => {
            if (error.code === 404) {
                res.statusMessage = error.message;
                return res.status(404).send();
            } else if (error.code === 401) {
                res.statusMessage = error.message;
                return res.status(401).send();
            }
        })

}); 

router.get('/api/validate', (req, res) => {
    let token = req.headers.authorization;
    token = token.replace('Bearer ', '');

    jwt.verify(token, 'secret', (err, user) => {
        if (err) {
            res.statusMessage = "Invalid token";
            return res.status(401).send();
        }

        console.log(user);
        return res.status(200).json({message: "Success"});
    });
});


router.get('/signup', (req, res) => {
    res.sendFile('/public/signup.html', { root: __dirname + '/../' })
});

module.exports = router;