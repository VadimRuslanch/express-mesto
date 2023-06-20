require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
const { login, createUser } = require('./controllers/users');


const app = express();
app.use(express.json());
// const auth = ((req, res, next) => {
//   req.user = {
//     _id: '6485cd144f2bbad724aa4820'
//   };
//   next();
// });
const { PORT = 3000 } = process.env;



mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
});

// app.use(auth);
app.post('/signin', login);
app.post('/signup', createUser);
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});