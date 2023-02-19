const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.set('strictQuery', false);

mongoose.connect(
  'mongodb://127.0.0.1/mestodb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

console.log('Я работаю!');

app.listen(PORT);
