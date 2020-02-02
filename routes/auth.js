let express = require("express");
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let router = express.Router();
let path = require('path');
let jwt = require('jsonwebtoken');

let {UserController} = require('../models/user');
let ServerError = require('../error');

router.post('/login', jsonParser, (req, res) => {
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
                throw new ServerError(401, "Invalid password");
            }

            let data = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName
            }

            let token = jwt.sign(data, 'secret', {
                expiresIn: 60 * 60
            });

            return res.status(200).json({token: token, id: user._id, firstName: user.firstName, lastName: user.lastName});
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

router.get('/validate/:token', (req, res) => {
    let token = req.params.token;

    jwt.verify(token, 'secret', (err, user) => {
        if (err) {
            res.statusMessage = "Invalid token";
            return res.status(401).json({message: "error"});
        }

        console.log(user);
        return res.status(200).json({message: "success", id: user.id, firstName: user.firstName, lastName: user.lastName});
    });
});

module.exports = router;