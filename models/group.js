let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const distanceEnum = {
    SHORT: 'short',
    MEDIUM: 'medium',
    LONG: 'long'
}

const priceEnum = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
}

let placeCollection = mongoose.Schema({
    name: {type: String},
    description: {type: String},
    location: {type: String},
    distanceCategory: Number,
    priceCategory: Number
});

let voteCollection = mongoose.Schema({
    pricePreference: Number,
    distancePreference: Number,
    dateTimeVoted: Date
});

let votingEventCollection = mongoose.Schema({
    dateTimeStart: Date,
    datetimeEnd: Date,
    vote: [voteCollection]
});

let groupCollection = mongoose.Schema({
    name: {type: String},
    description: {type: String},
    dateCreated: Date,
    voteFrequency: Number,
    image: String,
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    places: [placeCollection],
    votingEvents: [votingEventCollection]
});

let Group = mongoose.model('groups', groupCollection);

let GroupController = {
    getAll: function() {
        return Group.find()
            .then(groups => {
                return groups;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getById: function(id) {
        return Group.findById(id)
            .then(group => {
                return group;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getByMemberId: function(id) {
        return Group.find({members: {$in: [id]}})
            .then(gs => {
                return gs;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getMembersOfGroupById: function(id) {
        return Group.findById(id).populate('members').exec()
            .then(group => {
                return group;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    create: function(newGroup) {
        return Group.create(newGroup)
            .then(ng => {
                return ng;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    update: function(id, updatedGroup) {
        return Group.findOneAndUpdate(id, updatedGroup)
            .then(ug => {
                return ug;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    delete: function(id) {
        return Group.findByIdAndRemove(id)
            .then(rg => {
                return rg;
            })
            .catch(error => {
                throw Error(error);
            });
    }
}

module.exports = {GroupController}