let express = require("express");
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let router = express.Router();
let path = require('path');
let jwt = require('jsonwebtoken');
let places = require('../places');

let {GroupController} = require('../models/group');
let {PlaceController} = require('../models/place');
let ServerError = require('../error');

router.post('/create', jsonParser, (req, res) => {
    let {name, description, distanceCategory, priceCategory, group} = req.body;

    if (name == undefined || description == undefined || distanceCategory == undefined 
            || priceCategory == undefined || group == undefined) {
        res.statusMessage = "Parameters to create group incomplete";
        return res.status(406).send();
    }

    let image = places[Math.floor(Math.random() * places.length)];

    let newPlace = {
        name, description, distanceCategory, priceCategory, group, image
    }

    GroupController.getById(group)
        .then(g => {
            if (g == null) {
                throw new ServerError(404, "Group not found with ID");
            }

            return PlaceController.create(newPlace)
        })
        .then(np => {
            return res.status(201).json(np);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = error.message;
            res.status(error.code).send();
        });
});

router.get('/groups/:group_id', jsonParser, (req, res) => {
    let id = req.params.group_id;

    if (id == undefined) {
        res.statusMessage = "No id given to get places";
        return res.status(406).send();
    }

    PlaceController.getByGroupId(id)
        .then(places => {
            return res.status(200).json(places);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = error.message;
            res.status(error.code).send();
        });
});

router.get('/:id', jsonParser, (req, res) => {
    let id = req.params.id;

    if (id == undefined) {
        res.statusMessage = "No id given to get place";
        return res.status(406).send();
    }

    PlaceController.getById(id)
        .then(place => {
            if (place == null) {
                throw new ServerError(404, "ID not found");
            }
            return res.status(200).json(place);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = error.message;
            res.status(error.code).send();
        });
});

module.exports = router;

