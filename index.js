// Node Modules
let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let jsonParser = bodyParser.json();
let app = express();

// Routes
let userRoutes = require('./routes/users');

// Variables
let {DATABASE_URL, PORT} = require('./config');
let {UserController} = require('./models/user');

app.use(express.static('public'));
app.use(morgan('dev'));

app.use(userRoutes);

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