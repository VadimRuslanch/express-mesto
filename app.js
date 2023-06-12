const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});