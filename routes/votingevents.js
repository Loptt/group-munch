let express = require("express");
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let router = express.Router();
let path = require('path');
let jwt = require('jsonwebtoken');
let places = require('../places');

let {GroupController} = require('../models/group');
let {VotingEventController} = require('../models/votingevent');
let ServerError = require('../error');

router.post('/create', jsonParser, (req, res) => {
    let {dateTimeEnd, group} = req.body;

    if (dateTimeEnd == undefined || group == undefined) {
        res.statusMessage = "Parameters to create voting event incomplete";
        return res.status(406).send();
    }

    let newVotingEvent = {
        dateTimeEnd, group
    }

    GroupController.getById(group)
        .then(g => {
            if (g == null) {
                throw new ServerError(404, "Group not found with ID");
            }

            return VotingEventController.create(newVotingEvent);
        })
        .then(nve => {
            return res.status(201).json(nve);
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
        res.statusMessage = "No id given to get voting event";
        return res.status(406).send();
    }

    VotingEventController.getByGroupId(id)
        .then(votingEvent => {
            return res.status(200).json(votingEvent);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = error.message;
            res.status(error.code).send();
        });
});

router.put('/update/:votingevent_id', jsonParser, (req, res) => {
    let id = req.params.votingevent_id;

    if (id == undefined) {
        res.statusMessage = "No id given to update a voting event";
        return res.status(406).send();
    }

    VotingEventController.getById(id)
        .then(votingEvent => {
            if (votingEvent == null) {
                throw new ServerError(404, "ID not found");
            }

            let {dateTimeEnd} = req.body;

            if (dateTimeEnd == undefined) {
                res.statusMessage = "No parameters to modify in update";
                return res.status(409).send();
            }

            let newVotingEvent = {};

            newVotingEvent.dateTimeEnd = dateTimeEnd;

            return VotingEventController.update(id, newVotingEvent);
        })
        .then(nve => {
            return res.status(202).json(nve);
        })
        .catch(error => {
            console.log(error);
            if (error.code === 404) {
                res.statusMessage = "Voting event not found with given id";
                return res.status(404).send();
            } else {
                res.statusMessage = "Database error";
                return res.status(500).send();
            }
        });
});

router.delete('/delete/:votingevent_id', jsonParser, (req, res) => {
    let id = req.params.votingevent_id;

    if (id == undefined) {
        res.statusMessage = "No id given to delete a voting event";
        return res.status(406).send();
    }

    VotingEventController.delete(id)
        .then(dve => {
            return res.status(202).json(dve);
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
        res.statusMessage = "No id given to get voting event";
        return res.status(406).send();
    }

    VotingEventController.getById(id)
        .then(votingEvent => {
            if (votingEvent == null) {
                throw new ServerError(404, "ID not found");
            }
            return res.status(200).json(votingEvent);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = error.message;
            res.status(error.code).send();
        });
});

module.exports = router;