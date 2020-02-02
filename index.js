// Node Modules
let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let path = require('path');
let cors = require('cors');
let jsonParser = bodyParser.json();
let app = express();


// Routes
let userRoutes = require('./routes/users');
let groupRoutes = require('./routes/groups');
let placeRoutes = require('./routes/places');
let votingeventRoutes = require('./routes/votingevents');
let authRoutes = require('./routes/auth');

// Custom dependencies
let {DATABASE_URL, PORT} = require('./config');
let {UserController} = require('./models/user');
let middleware = require('./middleware');

app.use(cors());
app.use(morgan('dev'));

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/votingevents', votingeventRoutes)
app.use('/api', authRoutes);

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