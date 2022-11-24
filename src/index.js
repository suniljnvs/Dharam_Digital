const express = require('express');
const bodyParser = require('body-parser');

const route = require('./routes/route');
const mongoose = require('mongoose');



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// connect mongoose with this string

mongoose.connect("mongodb+srv://sumit1997:47R9ZsJHzXLDslLR@cluster0.zgrvw.mongodb.net/dharamDigital", { useNewUrlParser: true })
    .then(() => console.log('MongoDB is connected'))
    .catch(error => console.log(error));


app.use('/', route);

app.listen(process.env.PORT || 5002, function () {
    console.log('Express app running on port ' + (process.env.PORT || 5002));
});