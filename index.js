let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let jsonParser = bodyParser.json();
let app = express();

app.use(express.static('public'));
app.use(morgan('dev'));

app.listen(8080, () => {
    console.log("Server started and listening on port 8080");
});