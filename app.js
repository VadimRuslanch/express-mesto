const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();
const auth = ((req, res, next) => {
  req.user = {
    _id: '6485cd144f2bbad724aa4820'
  };
  next();
});

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
});

app.use(auth);
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});