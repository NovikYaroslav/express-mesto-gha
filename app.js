const express = require('express');
const mongoose = require('mongoose');
const { PORT } = require('./config');

const app = express();
const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT);

app.use(express.json());
app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, require('./routers/users'));
app.use('/cards', auth, require('./routers/cards'));
