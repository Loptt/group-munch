let express = require("express");
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let router = express.Router();
let path = require('path');
let jwt = require('jsonwebtoken');

let {GroupCountroller} = require('../models/group');
let ServerError = require('../error');

router.get('/api/group-by-id', jsonParser, (req, res) => {
    let id = req.query.id;

    if (id == undefined) {
        res.statusMessage = "No id given to get group";
        return res.status(406).send();
    }

    GroupController.getById(id)
        .then(group => {
            if (group == null) {
                throw new ServerError(404, "ID not found");
            }
            return res.status(200).json(user);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "Group not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});

router.get('/api/members-of-group', jsonParser, (req, res) => {
    let id = req.query.id;

    if (id == undefined) {
        res.statusMessage = "No id given to get members of group";
        return res.status(406).send();
    }

    

    GroupController.getById(id)
        .then(group => {
            if (group == null) {
                throw new ServerError(404, "ID not found");
            }
            return res.status(200).json(user);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "Group not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});


router.post('/api/create-group', jsonParser, (req, res) => {
    let groupName = req.body.name;
    let groupDescription = req.body.description;

    if (groupName == undefined || description == undefined) {
        res.statusMessage = "Parameters to create group incomplete";
        return res.status(406).send();
    }

    let newGroup = {
        name: groupName,
        description: groupDescription
    }

    return GroupController.create(newGroup);
});

router.put('/api/update-group', jsonParser, async (req, res) => {
    let id = req.query.id;

    if (id == undefined) {
        res.statusMessage = "No id given to update";
        return res.status(406).send();
    }

    GroupController.getById(id)
        .then(group => {
            if (group == null) {
                throw new ServerError(404, "ID not found");
            }

            let {name, description} = req.body;
        
            if (name == undefined && description == undefined) {
                res.statusMessage = "No parameters to modify in update";
                return res.status(409).send();
            }

            let newGroup = {};

            if (name != undefined) {
                newGroup.name = name;
            }
            if (description != undefined) {
                newGroup.description = description;
            }

            return GroupController.update(id, newGroup);
        })
        .then(ng => {
            return res.status(202).json(ng);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "Group not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
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