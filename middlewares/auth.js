const jsonwebtoken = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
  ERROR_CODE_401,
} = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    res.status(ERROR_CODE_401).send({ message: "Необходима авторизация" });
    return;
  }

  let payload;
  const jwt = authorization.replace("Bearer ", "");
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    res.status(ERROR_CODE_401).send({ message: "Необходима авторизация" });
    return;
  }

  req.user = payload;
  next();
};

module.exports = auth;
