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

app.listen(PORT);
app.use((req, res, next) => {
  req.user = {
    _id: '63f360857f4db8710e269555'
  };
  next();
});

app.use(express.json());
app.use('/users', require('./routers/users'));
app.use('/cards', require('./routers/cards'));
app.use('/signin', require('./routers/login'));



