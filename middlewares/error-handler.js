// const ERROR_CODE_400 = 400;

// const ERROR_CODE_404 = 404;

// const ERROR_CODE_500 = 500;

// const ERROR_CODE_401 = 401;

// const ERROR_CODE_409 = 409;

// const errorHandler = (err, res) => {
//   console.log('работаю errorHandler');
//   console.log(err);

//   if (err === 'ValidationError') {
//     res.status(ERROR_CODE_400).send({
//       message: 'Переданы некорректные данные в методы создания пользователя',
//     });
//   }
//   if (err.name === 'CastError') {
//     res.status(ERROR_CODE_404).send({ message: 'Пользователь не найден' });
//   }
//   if (err.code === ERROR_CODE_401) {
//     res.status(ERROR_CODE_401).send({ message: 'Пользователь не найден' });
//   }
//   if (err.code === ERROR_CODE_404) {
//     res.status(ERROR_CODE_404).send({ message: 'Страница не найдена' });
//   }
//   if (err.code === 11000) {
//     res
//       .status(ERROR_CODE_409)
//       .send({ message: 'Пользователь с такими данными уже существует' });
//   } else {
//     res.status(ERROR_CODE_500).send({ message: 'Произошла ошибка' });
//   }
// };

// module.exports = errorHandler;

// module.exports = (err, req, res, next) => {
//   const { statusCode = 500, message } = err;

//   res.status(statusCode).send({
//     message: statusCode === 500 ? 'Ошибка на сервере' : message,
//   });
//   next();
// };

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message =
    statusCode === 500
      ? `На сервере произошла ошибка: ${err.message}`
      : err.message;

  res.status(statusCode).send({ message });

  next();
};

module.exports = errorHandler;
