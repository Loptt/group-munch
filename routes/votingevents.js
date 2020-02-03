let express = require("express");
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let router = express.Router();
let path = require('path');
let jwt = require('jsonwebtoken');
let places = require('../places');

let {GroupController} = require('../models/group');
let {VotingEventController} = require('../models/votingevent');
let {UserController} = require('../models/user');
let {PlaceController} = require('../models/place');
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

router.get('/groups/:group_id/recent', jsonParser, (req, res) => {
    let id = req.params.group_id;

    if (id == undefined) {
        res.statusMessage = "No id given to get voting event";
        return res.status(406).send();
    }

    GroupController.getById(id)
        .then(group => {
            if (group == null) {
                throw new ServerError(404, "Group not found");
            }

            return VotingEventController.getByGroupId(id)
        })
        .then(votingEvent => {
            console.log('EVENTS ', votingEvent)
            if (votingEvent.length < 1) {
                console.log("NO EVENTS");
                throw new ServerError(404, "No events found");
            }
            votingEvent.sort((a, b) => a.dateTimeEnd - b.dateTimeEnd);

            let event;
            let currentDate = new Date();
            let filteredEvents = votingEvent.filter(ve => ve.dateTimeEnd > currentDate);

            console.log('FILTER ', filteredEvents);

            if (filteredEvents.length === 0) {
                console.log('All old');
                return res.status(200).json(votingEvent[votingEvent.length-1]);
            } else {
                filteredEvents.forEach((e) => {
                    /*if (!e.finished) {
                        return res.status(200).json(e);
                    }*/

                    return res.status(200).json(votingEvent[0]);
                })
            }

            return res.status(200).json(votingEvent[0]);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = error.message;
            return res.status(error.code).send();
        });
});

router.get('/groups/:group_id', jsonParser, (req, res) => {
    let id = req.params.group_id;

    if (id == undefined) {
        res.statusMessage = "No id given to get voting event";
        return res.status(406).send();
    }

    GroupController.getById(id)
        .then(group => {
            if (group == null) {
                throw new ServerError(404, "Group not found");
            }

            return VotingEventController.getByGroupId(id)
        })
        .then(votingEvent => {
            if (votingEvent == []) {
                throw new ServerError(404, "No events found");
            }
            return res.status(200).json(votingEvent);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = error.message;
            res.status(error.code).send();
        });
});


router.post('/:id/cast_vote', jsonParser, (req, res) => {
    let id = req.params.id;

    if (id == undefined) {
        res.statusMessage = "No id given to cast vote";
        return res.status(406).send();
    }

    let {user_id, place_id} = req.body;

    if (user_id == undefined || place_id == undefined) {
        res.statusMessage = "Parameters incomplete to cast vote";
        return res.status(406).send();
    }

    let foundGroup = {};

    UserController.getById(user_id)
        .then(user => {
            if (user == null) {
                throw new ServerError(404, "No user found with given ID");
            }

            return PlaceController.getById(place_id)
        })
        .then(place => {
            if (place == null) {
                throw new ServerError(404, "No place found with given ID");
            }

            return GroupController.getById(place.group)
        })
        .then(group => {
            if (group == null) {
                throw new ServerError(404, "No place found with given ID");
            }
            foundGroup = group;
            return VotingEventController.getById(id)
        })
        .then(ve => {
            if (ve == null) {
                throw new ServerError(404, "No event found with given ID");
            }
            let votes = ve.votes;
            let i = votes.findIndex(vote => vote.user == user_id);
            
            if (i >= 0) {
                throw new ServerError(409, "User already voted");
            }
            
            let date = new Date();

            let = newVote = {}
            
            votes.push({
                dateTimeVoted: date,
                user: user_id,
                place: place_id
            });
            
            let finished = false;
            
            if (votes.length === foundGroup.members.length) {
                finished = true;
                let placeVotes = new Map();

                let places = [];

                votes.forEach(vote => {
                    if (places.indexOf(vote.place.toString()) < 0) {
                        console.log("Adding " , vote.place.toString());
                        console.log("Index " , places.indexOf(vote.place.toString()));
                        places.push(vote.place.toString());
                    }
                });

                console.log('Places ', places);
                
                places.forEach(p => {
                    placeVotes.set(p, 0);
                });
                
                votes.forEach(v => {
                    placeVotes.set(v.place.toString(), placeVotes.get(v.place.toString())+1);
                })
                
                console.log('votes counted', placeVotes);
                let mostId;
                let most = -1;

                
                placeVotes.forEach((v, k)=> {
                    if (v > most) {
                        most = v;
                        mostId = k;
                    }
                });
                
                newVote = {
                    votes: votes,
                    finished: finished,
                    winner: mostId
                }
            } else {
                newVote = {
                    votes,
                    finished
                }
            }

            return VotingEventController.update(id, newVote);
        })
        .then(ve => {
            return res.status(202).json(ve);
        })
        .catch(error => {
            if (error.code === 404 || error.code === 409) {
                res.statusMessage = error.message;
                return res.status(error.code).send();
            }

            res.statusMessage = "Database error";
            return res.status(500).send();
        })
})


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