import AppError from "./appError.js";

export class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

export class CastError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class DuplicateKey extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class AuthenticationFailed extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401);
  }
}

export class MissingToken extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class InvalidAuthHeader extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class Forbidden extends AppError {
  constructor(message) {
    super(message, 403);
  }
}

export class EmailError extends AppError {
  constructor(message) {
    super(message, 500);
  }
}

export class BadRequest extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}
