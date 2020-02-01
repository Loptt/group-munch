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
    
}