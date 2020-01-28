let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let jsonParser = bodyParser.json();
let app = express();

let {DATABASE_URL, PORT} = require('./config');
let {UserController} = require('./models/user');

app.use(express.static('public'));
app.use(morgan('dev'));

app.get('/api/users', jsonParser, (req, res) => {
    UserController.getAll()
        .then(users => {
            return res.status(200).json(users);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "Database error";
            return res.status(500).send();
        })
});

app.get('/api/users-by-id', jsonParser, (req, res) => {
    let id = req.query.id;

    if (id == undefined) {
        res.statusMessage = "No id given to get users";
        res.status(406).send();
    }

    UserController.getById(id)
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "Database error";
            return res.status(500).send();
        });
});

app.post('/api/create-user', jsonParser, (req, res) => {
    let firstName, lastName, email, pp;

    firstName = req.body.firstName;
    lastName = req.body.lastName;
    email = req.body.email;
    pp = req.body.profilePicture;

    if (firstName == undefined || lastName == undefined || email == undefined || pp == undefined) {
        res.statusMessage = "Parameters to create users incomplete";
        return res.status(406).send();
    }

    let newUser = {
        name: {
            firstName: firstName,
            lastName: lastName
        },
        email: email,
        profilePicture: pp
    }

    UserController.create(newUser)
        .then(nu => {
            return res.status(201).json(nu);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "Database error";
            return res.status(500).send();
        });
});

let server;

function runServer(port, databaseUrl) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, response => {
            if (response) {
                return reject(response);
            }
            else {
                server = app.listen(port, () => {
                    console.log("App is running on port " + port);
                    resolve();
                })
                    .on('error', err => {
                        mongoose.disconnect();
                        return reject(err);
                    })
            }
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close(err => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
}

runServer(PORT, DATABASE_URL);

module.exports = {app, runServer, closeServer};