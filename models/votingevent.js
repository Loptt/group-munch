let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let voteCollection = mongoose.Schema({
    pricePreference: Number,
    distancePreference: Number,
    dateTimeVoted: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

let votingEventCollection = mongoose.Schema({
    dateTimeStart: Date,
    datetimeEnd: Date,
    vote: [voteCollection],
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups'
    }
});

let VotingEvent = mongoose.model('voting_events', votingEventCollection);

let VotingEventController = {
    getAll: function() {
        return VotingEvent.find()
            .then(votingEvents => {
                return votingEvents;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getById: function(id) {
        return VotingEvent.findById(id)
            .then(votingEvent => {
                return votingEvent;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getByGroupId: function(id) {
        return VotingEvent.find({group: id})
            .then(votingEvent => {
                return votingEvent;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    create: function(newVotingEvent) {
        return VotingEvent.create(newVotingEvent)
            .then(nve => {
                return nve;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    update: function(id, updatedVotingEvent) {
        return VotingEvent.findByIdAndUpdate(id, updatedVotingEvent)
            .then (uve => {
                return uve;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    delete: function(id) {
        return VotingEvent.findByIdAndRemove(id)
            .then(rve => {
                rve;
            })
            .catch(error => {
                throw Error(error);
            });
    }
}

module.exports = {
    VotingEventController
}