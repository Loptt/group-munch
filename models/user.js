let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let userCollection = mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    password: String
});

let User = mongoose.model('users', userCollection);

let UserController = {
    getAll: function() {
        return User.find()
            .then(users => {
                return users;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getById: function(id) {
        return User.findById(id)
            .then(user => {
                return user;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    getByEmail: function(email) {
        return User.findOne({email: email})
            .then(user => {
                return user;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    create: function(newUser) {
        return User.create(newUser)
            .then(nu => {
                return nu;
            })
            .catch(error => {
                throw Error(error);
            });
    },
    update: function(id, updatedUser) {
        return User.findByIdAndUpdate(id, updatedUser)
            .then(uu => {
                return uu;
            })
            .catch(error => {
                throw Error(error);
            })
    },
    delete: function(id) {
        return User.findByIdAndRemove(id)
            .then(ru => {
                return ru;
            })
            .catch(error => {
                throw Error(error);
            })
    }
}

module.exports = {UserController};