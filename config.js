const {JWT_SECRET = "Секретный код"} = process.env
const { PORT = 3000 } = process.env;


module.exports = {
  JWT_SECRET,
  PORT,
}