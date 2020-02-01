let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let placeCollection = mongoose.Schema({
    name: {type: String},
    description: {type: String},
    distanceCategory: Number,
    priceCategory: Number,
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'groups'
    },
    image: String
});

let Place = mongoose.model('places', placeCollection);

let PlaceController = {
    getAll: function() {
        return Place.find()
            .then(places => {
                return places;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getById: function(id) {
        return Place.findById(id)
            .then(places => {
                return places;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getByGroupId: function(id) {
        return Place.find({group: id})
            .then(places => {
                return places;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    create: function(newPlace) {
        return Place.create(newPlace)
            .then(np => {
                return np;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    update: function(id, updatedPlace) {
        return Place.findByIdAndUpdate(id, updatedPlace)
            .then(up => {
                return up;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    delete: function(id) {
        return Place.findByIdAndRemove(id)
            .then(rp => {
                return rp;
            })
            .catch(error => {
                throw Error(error);
            });
    }
}

module.exports = {
    PlaceController
}