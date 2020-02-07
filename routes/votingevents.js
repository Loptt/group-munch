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
let middleware = require('../middleware');
let voteintelligence = require('../voteintelligence');

router.post('/create', jsonParser, middleware.isLoggedIn, (req, res) => {
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

router.get('/groups/:group_id/recent', jsonParser, middleware.isLoggedIn, (req, res) => {
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
            if (votingEvent.length < 1) {
                throw new ServerError(404, "No events found");
            }

            // We sort the events in chronological order, oldest first
            votingEvent.sort((a, b) => a.dateTimeEnd - b.dateTimeEnd);

            let currentDate = new Date();

            // We filter the events to get all events that will take place in the future
            let filteredEvents = votingEvent.filter(ve => ve.dateTimeEnd > currentDate);

            let foundEvent;

            console.log("FUTURE EVENTS ", filteredEvents);

            let foundInFuture = false;

            if (filteredEvents.length === 0) {
                // If no events take place in the future, we get the most recent
                // event in the past
                foundEvent = votingEvent[votingEvent.length-1];
            } else {
                filteredEvents.forEach(ve => {
                    if (!ve.finished) {
                        foundEvent = ve;
                        foundInFuture = true;
                        console.log("Setting Curr ev to ", foundEvent);
                        return;
                    }
                })
                
                if (!foundInFuture)  {
                    foundEvent = votingEvent[votingEvent.length-1];
                    console.log("Setting Curr ev to other", foundEvent);
                }
            }

            // if the event is in the past and it doesn't have a winner, find the winner
            // and mark the event as finished
            if (foundEvent.dateTimeEnd < currentDate && !foundEvent.winner) {
                foundEvent.finished = true;
                foundEvent.winner = voteintelligence.findWinner(foundEvent.votes);
            }

            // We update the event if there are any changes
            VotingEventController.update(foundEvent._id, foundEvent)
                .then(fe => {
                    return res.status(200).json(foundEvent)
                })
                .catch(error => {
                    throw new ServerError(500, "Database error");
                })
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = error.message;
            return res.status(error.code).send();
        });
});

router.get('/groups/:group_id/recent-5', jsonParser, middleware.isLoggedIn, (req, res) => {
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
            if (votingEvent.length < 1) {
                throw new ServerError(404, "No events found");
            }

            // Sort events in chronological order, newest first
            let events = votingEvent.sort((a, b) => a.dateTimeEnd - b.dateTimeEnd);

            let currentDate = new Date();

            // Keek all events prior to current date
            let oldEvents = [];

            events.forEach(e => {
                if (e.finished) {
                    oldEvents.push(e);
                }
            });

            if (oldEvents.length > 5) {
                oldEvents = oldEvents.slice(oldEvents.length - 5);
            }

            return res.status(200).json(oldEvents.reverse());
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = error.message;
            return res.status(error.code).send();
        });
})

router.get('/groups/:group_id', jsonParser, middleware.isLoggedIn, (req, res) => {
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

router.post('/:id/cast_vote', jsonParser, middleware.isLoggedIn, (req, res) => {
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
                
                let winnerId = voteintelligence.findWinner(votes);
                
                newVote = {
                    votes: votes,
                    finished: finished,
                    winner: winnerId
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

router.put('/update/:votingevent_id', jsonParser, middleware.isLoggedIn, (req, res) => {
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

router.delete('/delete/:votingevent_id', jsonParser, middleware.isLoggedIn, (req, res) => {
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