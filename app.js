const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes/index');

const auth = require('./middlewares/auth');

const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
});

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});