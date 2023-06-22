require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const auth = require('./middlewares/auth');

const app = express();
app.use(bodyParser.json());

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const { login, createUser } = require('./controllers/users');

// const { PORT = 3000 } = process.env;
// mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
// });
// app.listen(PORT, () => {
//   // eslint-disable-next-line no-console
//   console.log(`App listening on port ${PORT}`);
// });

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(routes);

async function connect() {
  try {
    await mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://localhost:27017/mestodb');
    // eslint-disable-next-line no-console
    console.log(`App connected ${MONGO_URL}`);
    await app.listen(PORT);
    // eslint-disable-next-line no-console
    console.log(`App listening on port ${PORT}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

connect();
