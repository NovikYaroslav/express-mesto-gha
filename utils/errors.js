class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class AuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class PermissionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class DublicationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = {
  BadRequestError,
  AuthorizedError,
  PermissionError,
  NotFoundError,
  DublicationError,
};
