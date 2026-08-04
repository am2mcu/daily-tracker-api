import env from "../config/env.js";
import AppError from "../utils/appError.js";
import { CastError, DuplicateKey, ValidationError } from "../utils/errors.js";

class ErrorMiddleware {
  _createErrorJson = (err) => {
    let error = null;
    if (err instanceof AppError) error = err;
    else if (err.name === "CastError")
      error = new CastError(`${err.value} is not a valid ${err.path}`);
    else if (err.name === "ValidationError")
      error = new ValidationError(`${Object.values(err.errors)[0].message}`);
    else if (err.code === 11000)
      error = new DuplicateKey(
        `"${Object.values(err.errorResponse.keyValue)[0]}" is duplicate`,
      );
    else error = new AppError("Internal server error", 500);

    return {
      status: error.status,
      statusCode: error.statusCode,
      message: error.message,
      stack: this.isProd ? undefined : error.stack,
    };
  };

  _uiErrorHandler = (err, req, res, next) => {
    const error = this._createErrorJson(err);
    res.status(error.statusCode).render("error/error", error);
  };

  _apiErrorHandler = (err, req, res, next) => {
    const error = this._createErrorJson(err);
    res.status(error.statusCode).json({ status: error.status, error });
  };

  errorHandler = (err, req, res, next) => {
    this.isApi = req.originalUrl.startsWith("/api");
    this.isProd = env.NODE_ENV === "production";

    if (!this.isApi) return this._uiErrorHandler(err, req, res, next);

    this._apiErrorHandler(err, req, res, next);
  };
}

export default new ErrorMiddleware();
