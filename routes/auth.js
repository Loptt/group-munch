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

router.get('/validate', (req, res) => {
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

module.exports = router;