const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.set('strictQuery', false);

mongoose.connect(
  'mongodb://127.0.0.1/mestodb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
);

app.listen(PORT);
app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '63f360857f4db8710e269555',
  };
  next();
});
app.use('/users', require('./routers/users'));

app.use('/cards', require('./routers/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});
