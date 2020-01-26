let express = require('express');
let morgan = require('morgan');

let app = express();

app.use(express.static('public'));
app.use(morgan('dev'));

app.listen(8080, () => {
    console.log("Server started and listening on port 8080");
});