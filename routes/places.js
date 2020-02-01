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

            return PlaceController.create(newPlace);
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

router.put('/update/:place_id', jsonParser, (req, res) => {
    let id = req.params.place_id;

    if (id == undefined) {
        res.statusMessage = "No id given to update a place";
        return res.status(406).send();
    }

    PlaceController.getById(id)
        .then(place => {
            if (place == null) {
                throw new ServerError(404, "ID not found");
            }

            let {name, description, distanceCategory, priceCategory} = req.body;

            if (name == undefined && description == undefined && distanceCategory == undefined && 
                priceCategory == undefined) {
                res.statusMessage = "No parameters to modify in update";
                return res.status(409).send();
            }

            let newPlace = {};

            if (name != undefined) {
                newPlace.name = name;
            }
            if (description != undefined) {
                newPlace.description = description;
            }
            if (distanceCategory != undefined) {
                newPlace.distanceCategory = distanceCategory;
            }
            if (priceCategory != undefined) {
                newPlace.priceCategory = priceCategory;
            }

            return PlaceController.update(id, newPlace);
        })
        .then(np => {
            return res.status(202).json(np);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "Place not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});

router.delete('/delete/:place_id', jsonParser, (req, res) => {
    let id = req.params.place_id;

    if (id == undefined) {
        res.statusMessage = "No id given to delete a place";
        return res.status(406).send();
    }

    PlaceController.delete(id)
        .then(dp => {
            return res.status(202).json(dp);
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

